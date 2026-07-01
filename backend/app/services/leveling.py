"""Level-Schwellen aus docs/BADGES_AND_RANKS.md Abschnitt 5."""

LEVEL_THRESHOLDS: list[tuple[int, str]] = [
    (0, "Praktikant"),
    (50, "Handlanger"),
    (150, "Grubengräber"),
    (300, "Schaufelbeauftragter"),
    (500, "Polier"),
    (800, "Bauingenieur"),
    (1200, "Bauleiter"),
    (1800, "Camp Bürgermeister"),
    (2500, "Bierkönig"),
    (4000, "Helmpflicht Legende"),
]

FUNNEL_BADGE_THRESHOLDS: list[tuple[int, str]] = [
    (1, "Trichter-Einstand"),
    (5, "Trichterfreund"),
    (10, "Trichterkönig"),
    (20, "Trichterlegende"),
]


def level_for_points(points: int) -> str:
    level = LEVEL_THRESHOLDS[0][1]
    for threshold, name in LEVEL_THRESHOLDS:
        if points >= threshold:
            level = name
        else:
            break
    return level
