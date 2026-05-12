#!/usr/bin/env python3
"""Build EnchantedHerbCottage.mcaddon for Minecraft Bedrock 1.21+"""
import json, os, struct, zipfile, zlib

OUTPUT = "/home/user/taste-skill/EnchantedHerbCottage.mcaddon"

# ── minimal solid-colour PNG ─────────────────────────────────────────────────
def _chunk(tag: bytes, data: bytes) -> bytes:
    payload = tag + data
    return struct.pack(">I", len(data)) + payload + struct.pack(">I", zlib.crc32(payload) & 0xFFFFFFFF)

def make_png(r: int, g: int, b: int, a: int = 255, w: int = 16, h: int = 16) -> bytes:
    ihdr = _chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    raw  = b"".join(b"\x00" + bytes([r, g, b, a] * w) for _ in range(h))
    idat = _chunk(b"IDAT", zlib.compress(raw, 9))
    iend = _chunk(b"IEND", b"")
    return b"\x89PNG\r\n\x1a\n" + ihdr + idat + iend

# ── herb data: (id, display, vanilla_source, effect, dur_s, amp, nutrition, sat) ──
HERBS = [
    ("chamomile",  "Chamomile",  "minecraft:dandelion",   "night_vision", 120, 0, 3, 0.4),
    ("lavender",   "Lavender",   "minecraft:allium",      "slow_falling", 120, 0, 3, 0.4),
    ("mint",       "Mint",       "minecraft:lily_pad",    "speed",         60, 0, 2, 0.3),
    ("rosemary",   "Rosemary",   "minecraft:poppy",       "strength",      60, 0, 2, 0.4),
    ("thyme",      "Thyme",      "minecraft:blue_orchid", "regeneration",  30, 0, 2, 0.6),
    ("wildflower", "Wildflower", "minecraft:oxeye_daisy", "jump_boost",   120, 0, 2, 0.3),
]

ITEM_COLORS = {
    "chamomile_fresh":   (220, 210, 120), "chamomile_dried":   (210, 190, 130), "chamomile_tea":   (230, 200,  70),
    "lavender_fresh":    (180, 150, 220), "lavender_dried":    (150, 120, 160), "lavender_tea":    (160,  90, 200),
    "mint_fresh":        ( 80, 200, 130), "mint_dried":        (120, 160, 120), "mint_tea":        ( 90, 220, 160),
    "rosemary_fresh":    ( 60, 140,  80), "rosemary_dried":    ( 90, 110,  70), "rosemary_tea":    (160,  90,  50),
    "thyme_fresh":       (100, 150,  60), "thyme_dried":       (140, 130,  80), "thyme_tea":       (200, 160,  50),
    "wildflower_fresh":  (230, 150, 180), "wildflower_dried":  (180, 140, 150), "wildflower_tea":  (220, 120, 160),
    "flower_bundle":     (230, 160, 200),
    "woven_basket":      (180, 140,  80),
    "brewing_pestle":    (150, 130, 110),
}

BLOCK_COLORS = {
    "drying_rack":        (140, 100,  60),
    "thatched_block":     (200, 170,  70),
    "thatched_slab":      (198, 168,  68),
    "moss_oak_log":       ( 90, 120,  70),
    "moss_birch_log":     (160, 180, 140),
    "woven_basket_block": (180, 140,  80),
}

files: dict[str, bytes] = {}

def jf(path: str, data) -> None:
    files[path] = json.dumps(data, indent=2).encode()

def pf(path: str, r: int, g: int, b: int, w: int = 16, h: int = 16) -> None:
    files[path] = make_png(r, g, b, w=w, h=h)

# ════════════════════════════════════════════════════════════════════════════════
# BEHAVIOR PACK
# ════════════════════════════════════════════════════════════════════════════════
BP = "ehc_bp"

jf(f"{BP}/manifest.json", {
    "format_version": 2,
    "header": {
        "name": "Enchanted Herb Cottage BP",
        "description": "Cottagecore herb farming, drying racks & tea brewing.",
        "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "version": [1, 0, 0],
        "min_engine_version": [1, 21, 0]
    },
    "modules": [{"type": "data", "uuid": "b2c3d4e5-f6a7-8901-bcde-f12345678901", "version": [1, 0, 0]}],
    "dependencies": [{"uuid": "c3d4e5f6-a7b8-9012-cdef-123456789012", "version": [1, 0, 0]}]
})
pf(f"{BP}/pack_icon.png", 200, 170, 70, w=128, h=128)

# fresh herb items
for h_id, h_name, *_ in HERBS:
    jf(f"{BP}/items/{h_id}_fresh.json", {
        "format_version": "1.21.0",
        "minecraft:item": {
            "description": {"identifier": f"ehc:{h_id}_fresh", "menu_category": {"category": "nature"}},
            "components": {
                "minecraft:max_stack_size": 64,
                "minecraft:icon": {"textures": {"default": f"{h_id}_fresh"}}
            }
        }
    })

# dried herb items
for h_id, h_name, *_ in HERBS:
    jf(f"{BP}/items/{h_id}_dried.json", {
        "format_version": "1.21.0",
        "minecraft:item": {
            "description": {"identifier": f"ehc:{h_id}_dried", "menu_category": {"category": "nature"}},
            "components": {
                "minecraft:max_stack_size": 64,
                "minecraft:icon": {"textures": {"default": f"{h_id}_dried"}}
            }
        }
    })

# tea items (food with effects)
for h_id, h_name, _src, effect, dur, amp, nutrition, sat in HERBS:
    jf(f"{BP}/items/{h_id}_tea.json", {
        "format_version": "1.21.0",
        "minecraft:item": {
            "description": {"identifier": f"ehc:{h_id}_tea", "menu_category": {"category": "items"}},
            "components": {
                "minecraft:max_stack_size": 16,
                "minecraft:icon": {"textures": {"default": f"{h_id}_tea"}},
                "minecraft:use_animation": "drink",
                "minecraft:food": {
                    "nutrition": nutrition,
                    "saturation_modifier": sat,
                    "can_always_eat": True,
                    "effects": [{"name": effect, "chance": 1.0, "duration": dur, "amplifier": amp}]
                }
            }
        }
    })

# misc items
jf(f"{BP}/items/flower_bundle.json", {
    "format_version": "1.21.0",
    "minecraft:item": {
        "description": {"identifier": "ehc:flower_bundle", "menu_category": {"category": "nature"}},
        "components": {
            "minecraft:max_stack_size": 16,
            "minecraft:icon": {"textures": {"default": "flower_bundle"}}
        }
    }
})

jf(f"{BP}/items/woven_basket.json", {
    "format_version": "1.21.0",
    "minecraft:item": {
        "description": {"identifier": "ehc:woven_basket", "menu_category": {"category": "items"}},
        "components": {
            "minecraft:max_stack_size": 16,
            "minecraft:icon": {"textures": {"default": "woven_basket"}},
            "minecraft:block_placer": {"block": "ehc:woven_basket_block"}
        }
    }
})

jf(f"{BP}/items/brewing_pestle.json", {
    "format_version": "1.21.0",
    "minecraft:item": {
        "description": {"identifier": "ehc:brewing_pestle", "menu_category": {"category": "items"}},
        "components": {
            "minecraft:max_stack_size": 1,
            "minecraft:icon": {"textures": {"default": "brewing_pestle"}},
            "minecraft:durability": {"max_durability": 250}
        }
    }
})

# ── blocks ───────────────────────────────────────────────────────────────────
def block_json(identifier, tex_key, destroy_time, map_color):
    return {
        "format_version": "1.21.0",
        "minecraft:block": {
            "description": {"identifier": f"ehc:{identifier}", "menu_category": {"category": "construction"}},
            "components": {
                "minecraft:display_name": f"tile.ehc:{identifier}.name",
                "minecraft:material_instances": {"*": {"texture": tex_key, "render_method": "opaque"}},
                "minecraft:destructible_by_mining": {"seconds_to_destroy": destroy_time},
                "minecraft:destructible_by_explosion": {"explosion_resistance": 3},
                "minecraft:map_color": map_color
            }
        }
    }

jf(f"{BP}/blocks/drying_rack.json",        block_json("drying_rack",        "ehc_drying_rack",        1.5, "#8C6440"))
jf(f"{BP}/blocks/thatched_block.json",     block_json("thatched_block",     "ehc_thatched_block",     0.8, "#C8AA46"))
jf(f"{BP}/blocks/moss_oak_log.json",       block_json("moss_oak_log",       "ehc_moss_oak_log",       2.0, "#5A7846"))
jf(f"{BP}/blocks/moss_birch_log.json",     block_json("moss_birch_log",     "ehc_moss_birch_log",     2.0, "#A0B48C"))
jf(f"{BP}/blocks/woven_basket_block.json", block_json("woven_basket_block", "ehc_woven_basket_block", 1.0, "#B48C50"))

jf(f"{BP}/blocks/thatched_slab.json", {
    "format_version": "1.21.0",
    "minecraft:block": {
        "description": {"identifier": "ehc:thatched_slab", "menu_category": {"category": "construction"}},
        "components": {
            "minecraft:display_name": "tile.ehc:thatched_slab.name",
            "minecraft:geometry": {"identifier": "geometry.ehc.thatched_slab"},
            "minecraft:material_instances": {"*": {"texture": "ehc_thatched_block", "render_method": "opaque"}},
            "minecraft:collision_box": {"origin": [-8, 0, -8], "size": [16, 8, 16]},
            "minecraft:selection_box": {"origin": [-8, 0, -8], "size": [16, 8, 16]},
            "minecraft:destructible_by_mining": {"seconds_to_destroy": 0.8},
            "minecraft:destructible_by_explosion": {"explosion_resistance": 3},
            "minecraft:map_color": "#C8AA46"
        }
    }
})

# ── recipes: furnace-dry fresh → dried ────────────────────────────────────────
for h_id, *_ in HERBS:
    jf(f"{BP}/recipes/dry_{h_id}.json", {
        "format_version": "1.21.0",
        "minecraft:recipe_furnace": {
            "description": {"identifier": f"ehc:dry_{h_id}"},
            "tags": ["furnace", "smoker", "campfire"],
            "input": f"ehc:{h_id}_fresh",
            "output": f"ehc:{h_id}_dried"
        }
    })

# ── recipes: brew teas ─────────────────────────────────────────────────────────
for h_id, *_ in HERBS:
    jf(f"{BP}/recipes/brew_{h_id}_tea.json", {
        "format_version": "1.21.0",
        "minecraft:recipe_shapeless": {
            "description": {"identifier": f"ehc:brew_{h_id}_tea"},
            "ingredients": [
                {"item": f"ehc:{h_id}_dried", "count": 2},
                {"item": "minecraft:glass_bottle", "count": 1}
            ],
            "result": {"item": f"ehc:{h_id}_tea", "count": 1},
            "tags": ["crafting_table"]
        }
    })

# ── recipes: harvest fresh herbs from vanilla flowers ─────────────────────────
for h_id, h_name, source, *_ in HERBS:
    jf(f"{BP}/recipes/harvest_{h_id}.json", {
        "format_version": "1.21.0",
        "minecraft:recipe_shapeless": {
            "description": {"identifier": f"ehc:harvest_{h_id}"},
            "ingredients": [{"item": source, "count": 2}],
            "result": {"item": f"ehc:{h_id}_fresh", "count": 1},
            "tags": ["crafting_table"]
        }
    })

# ── recipes: blocks & tools ────────────────────────────────────────────────────
jf(f"{BP}/recipes/craft_drying_rack.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shaped": {
        "description": {"identifier": "ehc:craft_drying_rack"},
        "pattern": ["STS", "S S", "   "],
        "key": {"S": {"item": "minecraft:stick"}, "T": {"item": "minecraft:string"}},
        "result": {"item": "ehc:drying_rack", "count": 1},
        "tags": ["crafting_table"]
    }
})

jf(f"{BP}/recipes/craft_thatched_block.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shaped": {
        "description": {"identifier": "ehc:craft_thatched_block"},
        "pattern": ["WWW", "WWW", "WWW"],
        "key": {"W": {"item": "minecraft:wheat"}},
        "result": {"item": "ehc:thatched_block", "count": 4},
        "tags": ["crafting_table"]
    }
})

jf(f"{BP}/recipes/craft_thatched_slab.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shaped": {
        "description": {"identifier": "ehc:craft_thatched_slab"},
        "pattern": ["   ", "TTT", "   "],
        "key": {"T": {"item": "ehc:thatched_block"}},
        "result": {"item": "ehc:thatched_slab", "count": 6},
        "tags": ["crafting_table"]
    }
})

jf(f"{BP}/recipes/craft_moss_oak_log.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shapeless": {
        "description": {"identifier": "ehc:craft_moss_oak_log"},
        "ingredients": [{"item": "minecraft:oak_log"}, {"item": "minecraft:vine"}, {"item": "minecraft:vine"}],
        "result": {"item": "ehc:moss_oak_log", "count": 1},
        "tags": ["crafting_table"]
    }
})

jf(f"{BP}/recipes/craft_moss_birch_log.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shapeless": {
        "description": {"identifier": "ehc:craft_moss_birch_log"},
        "ingredients": [{"item": "minecraft:birch_log"}, {"item": "minecraft:vine"}, {"item": "minecraft:vine"}],
        "result": {"item": "ehc:moss_birch_log", "count": 1},
        "tags": ["crafting_table"]
    }
})

jf(f"{BP}/recipes/craft_flower_bundle.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shapeless": {
        "description": {"identifier": "ehc:craft_flower_bundle"},
        "ingredients": [
            {"item": "minecraft:poppy"},
            {"item": "minecraft:dandelion"},
            {"item": "minecraft:string"}
        ],
        "result": {"item": "ehc:flower_bundle", "count": 1},
        "tags": ["crafting_table"]
    }
})

jf(f"{BP}/recipes/craft_woven_basket.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shaped": {
        "description": {"identifier": "ehc:craft_woven_basket"},
        "pattern": ["S S", "SSS", "   "],
        "key": {"S": {"item": "minecraft:string"}},
        "result": {"item": "ehc:woven_basket", "count": 1},
        "tags": ["crafting_table"]
    }
})

jf(f"{BP}/recipes/craft_brewing_pestle.json", {
    "format_version": "1.21.0",
    "minecraft:recipe_shaped": {
        "description": {"identifier": "ehc:craft_brewing_pestle"},
        "pattern": [" S ", " S ", " B "],
        "key": {"S": {"item": "minecraft:stone"}, "B": {"item": "minecraft:bowl"}},
        "result": {"item": "ehc:brewing_pestle", "count": 1},
        "tags": ["crafting_table"]
    }
})

# ════════════════════════════════════════════════════════════════════════════════
# RESOURCE PACK
# ════════════════════════════════════════════════════════════════════════════════
RP = "ehc_rp"

jf(f"{RP}/manifest.json", {
    "format_version": 2,
    "header": {
        "name": "Enchanted Herb Cottage RP",
        "description": "Cottagecore herb farming, drying racks & tea brewing.",
        "uuid": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "version": [1, 0, 0],
        "min_engine_version": [1, 21, 0]
    },
    "modules": [{"type": "resources", "uuid": "d4e5f6a7-b8c9-0123-defa-234567890123", "version": [1, 0, 0]}]
})
pf(f"{RP}/pack_icon.png", 200, 170, 70, w=128, h=128)

# blocks.json – ties block identifiers to textures & sounds
jf(f"{RP}/blocks.json", {
    "format_version": [1, 1, 0],
    "ehc:drying_rack":        {"textures": "ehc_drying_rack",        "sound": "wood"},
    "ehc:thatched_block":     {"textures": "ehc_thatched_block",     "sound": "grass"},
    "ehc:thatched_slab":      {"textures": "ehc_thatched_block",     "sound": "grass"},
    "ehc:moss_oak_log":       {"textures": "ehc_moss_oak_log",       "sound": "wood"},
    "ehc:moss_birch_log":     {"textures": "ehc_moss_birch_log",     "sound": "wood"},
    "ehc:woven_basket_block": {"textures": "ehc_woven_basket_block", "sound": "wood"},
})

# item_texture.json
jf(f"{RP}/textures/item_texture.json", {
    "resource_pack_name": "EnchantedHerbCottage",
    "texture_name": "atlas.items",
    "texture_data": {name: {"textures": f"textures/items/{name}"} for name in ITEM_COLORS}
})

# terrain_texture.json
jf(f"{RP}/textures/terrain_texture.json", {
    "resource_pack_name": "EnchantedHerbCottage",
    "texture_name": "atlas.terrain",
    "texture_data": {f"ehc_{name}": {"textures": f"textures/blocks/{name}"} for name in BLOCK_COLORS}
})

# item PNGs
for name, (r, g, b) in ITEM_COLORS.items():
    pf(f"{RP}/textures/items/{name}.png", r, g, b)

# block PNGs
for name, (r, g, b) in BLOCK_COLORS.items():
    pf(f"{RP}/textures/blocks/{name}.png", r, g, b)

# thatched slab custom geometry (bottom-half slab)
jf(f"{RP}/models/blocks/thatched_slab.geo.json", {
    "format_version": "1.12.0",
    "minecraft:geometry": [{
        "description": {
            "identifier": "geometry.ehc.thatched_slab",
            "texture_width": 16, "texture_height": 16,
            "visible_bounds_width": 2, "visible_bounds_height": 1.5,
            "visible_bounds_offset": [0, 0.25, 0]
        },
        "bones": [{
            "name": "bb_main", "pivot": [0, 0, 0],
            "cubes": [{
                "origin": [-8, 0, -8], "size": [16, 8, 16],
                "uv": {
                    "north": {"uv": [0, 0], "uv_size": [16, 8]},
                    "south": {"uv": [0, 0], "uv_size": [16, 8]},
                    "east":  {"uv": [0, 0], "uv_size": [16, 8]},
                    "west":  {"uv": [0, 0], "uv_size": [16, 8]},
                    "up":    {"uv": [0, 0], "uv_size": [16, 16]},
                    "down":  {"uv": [0, 0], "uv_size": [16, 16]}
                }
            }]
        }]
    }]
})

# language file
lang_lines = []
for h_id, h_name, *_ in HERBS:
    lang_lines += [
        f"item.ehc:{h_id}_fresh.name=Fresh {h_name}",
        f"item.ehc:{h_id}_dried.name=Dried {h_name}",
        f"item.ehc:{h_id}_tea.name={h_name} Tea",
    ]
lang_lines += [
    "item.ehc:flower_bundle.name=Flower Bundle",
    "item.ehc:woven_basket.name=Woven Basket",
    "item.ehc:brewing_pestle.name=Brewing Pestle",
    "tile.ehc:drying_rack.name=Drying Rack",
    "tile.ehc:thatched_block.name=Thatched Block",
    "tile.ehc:thatched_slab.name=Thatched Slab",
    "tile.ehc:moss_oak_log.name=Mossy Oak Log",
    "tile.ehc:moss_birch_log.name=Mossy Birch Log",
    "tile.ehc:woven_basket_block.name=Woven Basket",
    "pack.name=Enchanted Herb Cottage",
    "pack.description=Cottagecore herb farming, drying racks & tea brewing",
]
files[f"{RP}/texts/en_US.lang"] = "\n".join(lang_lines).encode()
files[f"{RP}/texts/languages.json"] = json.dumps(["en_US"]).encode()

# ── write .mcaddon (zip of both packs) ───────────────────────────────────────
with zipfile.ZipFile(OUTPUT, "w", zipfile.ZIP_DEFLATED) as zf:
    for path, data in sorted(files.items()):
        zf.writestr(path, data)

size = os.path.getsize(OUTPUT)
print(f"Done! {len(files)} files → {OUTPUT}")
print(f"Size: {size:,} bytes ({size // 1024} KB)")
print("\nFile list:")
with zipfile.ZipFile(OUTPUT) as zf:
    for name in sorted(zf.namelist()):
        print(f"  {name}")
