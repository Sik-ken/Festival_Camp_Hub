"""100 Challenges für Camp Helmpflicht / Deichbrand Festival.

Format je Eintrag: (title, description, points, unlock_points)
unlock_points == 0  -> offen (50 Stück)
unlock_points  > 0  -> gesperrt bis Punktestand erreicht ist (50 Stück,
                       Schwellen an die Level aus BADGES_AND_RANKS.md angelehnt)

Dies ist ein Erstentwurf mit Deichbrand-/Camp-Helmpflicht-Bezug. Vor dem
Festival gemeinsam durchsehen und Formulierungen bei Bedarf anpassen.
"""

OPEN_SMALL = [
    ("Bauhelm-Selfie", "Mach ein Selfie mit Bauhelm.", 15),
    ("Warnwesten-Selfie", "Mach ein Selfie in Warnweste.", 15),
    ("Camp-Fahne", "Foto vor der Camp-Fahne.", 15),
    ("Trichter-Becher", "Foto mit deinem Trichter-Becher.", 15),
    ("Zeltaufbau", "Foto beim Zelt-Aufbau.", 15),
    ("Lieblingsgetränk", "Foto mit deinem Lieblingsgetränk.", 15),
    ("Fremder Helm", "Foto mit einer fremden Person, die auch einen Bauhelm trägt.", 15),
    ("High Five", "Foto beim High Five mit jemandem.", 15),
    ("Sonnenbrillen-Foto", "Foto mit Sonnenbrille.", 15),
    ("Camp-Nachbarn", "Foto mit euren Camp-Nachbarn.", 15),
    ("Infotafel", "Foto an der Infotafel des Festivals.", 15),
    ("Weste drüber", "Foto mit Warnweste über deinem Outfit.", 15),
    ("Ticket-Beweis", "Foto mit deinem Festival-Ticket oder -Band.", 15),
    ("Haupteingang", "Foto vor dem Haupteingang des Festivals.", 15),
    ("Foodtruck", "Foto an einem Foodtruck.", 15),
    ("Dreier-Gruppe", "Foto mit mindestens drei Personen.", 15),
    ("Lustiges Schild", "Foto mit einem lustigen Schild auf dem Gelände.", 15),
    ("Camp-Buddy", "Foto mit deinem Camp-Buddy.", 15),
    ("Spielgerät", "Foto an einer Slackline oder einem Spielgerät auf dem Gelände.", 15),
    ("Merch-Stand", "Foto an einem Merch-Stand.", 15),
    ("Warteschlange", "Foto in einer Warteschlange, gute Laune Pflicht.", 15),
    ("Bühnenblick", "Foto mit Blick auf eine Bühne aus der Ferne.", 15),
    ("Trockentrichter", "Foto in Trichterhaltung mit einer Dose, ganz ohne zu trinken.", 15),
    ("Camp-Grill", "Foto am Camp-Grill.", 15),
    ("Zeltblick", "Foto mit deinem Zelt im Hintergrund.", 15),
]

OPEN_MEDIUM = [
    ("Bühnen-Selfie", "Selfie vor einer Bühne während eines Konzerts.", 45),
    ("Neue Gesichter", "Foto mit Festivalbesuchern, die du gerade erst kennengelernt hast.", 45),
    ("Trinkspiel-Beweis", "Foto während eines Trinkspiels.", 45),
    ("Infield-Foto", "Foto im Infield.", 45),
    ("Beach Area", "Foto an der Beach Area.", 45),
    ("Nachtlicht", "Foto bei Nacht mit Bühnenlicht im Hintergrund.", 45),
    ("Sonnenaufgang", "Foto bei Sonnenaufgang.", 45),
    ("Große Gruppe", "Foto mit mindestens sechs Personen.", 45),
    ("Andere Stadt", "Foto mit jemandem aus einer anderen Stadt.", 45),
    ("Anderes Bundesland", "Foto mit jemandem aus einem anderen Bundesland.", 45),
    ("Tanzmoment", "Foto beim Tanzen vor einer Bühne.", 45),
    ("Facepaint", "Foto mit Bemalung oder Facepaint.", 45),
    ("DJ im Hintergrund", "Foto mit einem Act oder DJ sichtbar im Hintergrund.", 45),
    ("Vierer-Anstoßen", "Foto beim Anstoßen mit mindestens vier Bechern.", 45),
    ("Local-Tipp", "Foto mit jemandem, der dir einen guten Festival-Tipp gegeben hat.", 45),
    ("Nasses Shooting", "Foto mit nasser Kleidung, egal ob Regen oder Wasser.", 45),
    ("Arme hoch", "Foto in der Menge mit erhobenen Armen.", 45),
    ("Selbstbau-Accessoire", "Foto mit einem selbstgebastelten Camp-Accessoire.", 45),
    ("Freundliches Security", "Freundliches Foto mit Ordnungspersonal.", 45),
    ("Dämmerungscamp", "Foto mit eurem Camp bei Dämmerung.", 45),
    ("Regenschutz", "Foto mit Regenschirm oder Regenponcho.", 45),
    ("Bar-Warteschlange", "Foto beim Anstehen an der Bar.", 45),
    ("Fan-Outfit", "Foto mit einem selbstgemachten Fan-Outfit einer Band.", 45),
    ("Team-Foto", "Foto mit deinem kompletten Camp-Team.", 45),
    ("Festival-Grimasse", "Foto mit der besten Festival-Grimasse, die du hinbekommst.", 45),
]

LOCKED_TIERS = [
    (
        500,
        80,
        [
            ("Crowd-Versuch", "Foto beim Crowdsurfen oder zumindest beim Versuch.", None),
            ("Nach dem Gig", "Foto mit einem Act nach seinem Auftritt.", None),
            ("Zehn Becher", "Foto mit zehn verschiedenen Trichter-Bechern in einem Bild.", None),
            ("Polonaise", "Foto mitten in einer Polonaise.", None),
            ("Camp-Diplomatie", "Foto mit einem Camp aus einem anderen Bundesland.", None),
            ("Action-Sprung", "Action-Foto beim Sprung vor einer Bühne.", None),
            ("Regen-Bauwerk", "Foto mit eurem improvisierten Regenschutz-Bauwerk.", None),
            ("Konfetti-Moment", "Foto mit Feuerwerk oder Konfetti im Hintergrund.", None),
            ("Dreifach-Trichter", "Foto beim gleichzeitigen Trichtern zu dritt.", None),
            ("Banner-Kunst", "Foto mit eurem handgemalten Camp-Helmpflicht-Banner.", None),
        ],
    ),
    (
        1200,
        100,
        [
            ("Sonnenaufgang Beach", "Foto bei Sonnenaufgang direkt an der Beach Area.", None),
            ("Drei Camps", "Foto mit Personen aus mindestens drei verschiedenen Camps.", None),
            ("Stagedive-Moment", "Foto beim Stagediven oder direkt davor, falls erlaubt.", None),
            ("Warnwesten-Trupp", "Foto mit einer kompletten Warnwesten-Gruppe von mindestens fünf Personen.", None),
            ("Bauzaun-Kunstwerk", "Foto mit einem selbstgestalteten Bauzaun-Kunstwerk.", None),
            ("Act High Five", "Foto beim High Five mit einem Act oder einer Band.", None),
            ("Helm-Pyramide", "Foto mit einer Bauhelm-Pyramide eures Camps.", None),
            ("Zelt-Deko", "Foto mit eurer selbstgebauten Zelt-Deko.", None),
            ("Letzter Song", "Foto beim letzten Song eines Headliners.", None),
            ("Zwei-Uhr-Wachheit", "Foto um zwei Uhr nachts, hellwach und aktiv.", None),
        ],
    ),
    (
        1800,
        125,
        [
            ("Ganzes Camp", "Foto mit dem gesamten Camp Helmpflicht auf einem Bild.", None),
            ("Trichter-Trophäe", "Foto mit einer improvisierten Trophäe für den besten Trichter.", None),
            ("Letzter-Tag-Erwachen", "Foto direkt nach dem Aufwachen am letzten Festivaltag.", None),
            ("Fünf Trichterwarte", "Foto mit fünf Trichterwarten gleichzeitig.", None),
            ("Dunkle Hauptbühne", "Foto vor der Hauptbühne bei völliger Dunkelheit.", None),
            ("Geliehener Helm", "Foto mit einem Bauhelm, den dir eine fremde Person geliehen hat.", None),
            ("Sonnenuntergangsbier", "Foto beim gemeinsamen Bier zum Sonnenuntergang.", None),
            ("Fern-Fahne", "Foto mit eurer Helmpflicht-Fahne, sichtbar von einer Bühne aus der Ferne.", None),
            ("Tanzreihe", "Foto mit einer kompletten Reihe tanzender, fremder Menschen.", None),
            ("Aufräum-Team", "Foto mit deinem Camp beim gemeinsamen Aufräumen.", None),
        ],
    ),
    (
        2500,
        180,
        [
            ("Fünfzehn Trichter", "Foto mit mindestens fünfzehn Personen, die alle einen Trichter halten.", None),
            ("Persönliches Highlight", "Foto von deinem ganz persönlichen Festival-Highlight.", None),
            ("Local-Held", "Foto mit der Person, die dir am Festival am meisten geholfen hat.", None),
            ("Trichterwart-Team", "Foto mit dem kompletten Trichterwart-Team.", None),
            ("Regen-Laune", "Foto bei Regen mit maximal guter Laune als Beweis.", None),
            ("Konzertzitat", "Foto mit einem handgeschriebenen Zitat von deinem Lieblingskonzert.", None),
            ("Generationen-Treffen", "Foto mit der größten Altersspanne, die du auf dem Gelände findest.", None),
            ("Helme im Sonnenuntergang", "Foto mit dem ganzen Camp in Bauhelmen zum Sonnenuntergang.", None),
            ("Becher-Turm", "Foto mit einem gestapelten Trichter-Becher-Turm.", None),
            ("Größter Konzertmoment", "Foto direkt nach dem größten Konzert-Moment deines Festivals.", None),
        ],
    ),
    (
        4000,
        220,
        [
            ("Bauleiter-Outfit", "Foto von dir als Bauleiter des Camps mit Helm, Weste und Trichter.", None),
            ("Letzter Abend", "Foto mit dem kompletten Camp Helmpflicht am letzten Abend.", None),
            ("Camp-Hymne", "Foto vom Moment eurer selbst gedichteten Camp-Hymne.", None),
            ("Becher-Berg", "Foto mit dem größten Trichter-Becher-Haufen deines gesamten Festivals.", None),
            ("Letzter Sonnenaufgang", "Foto vom Sonnenaufgang am allerletzten Festivaltag.", None),
            ("Abschluss-Gruppenbild", "Abschließendes Gruppenfoto des kompletten Camps.", None),
            ("Persönliche Bilanz", "Foto mit deiner handgeschriebenen Festival-Bilanz: Punkte, Trichter, Highlights.", None),
            ("Stolzer Abbau", "Foto beim Camp-Abbau mit stolzem Blick zurück.", None),
            ("Hub-Branding", "Foto mit dem Helmpflicht-Hub-Branding irgendwo im Camp.", None),
            ("Legenden-Moment", "Dein ultimativer Helmpflicht-Legende-Moment, freie Wahl.", None),
        ],
    ),
]


def build_challenges() -> list[dict]:
    entries: list[dict] = []
    sort_order = 0

    for title, description, points in OPEN_SMALL + OPEN_MEDIUM:
        sort_order += 1
        entries.append(
            {
                "title": title,
                "description": description,
                "points": points,
                "unlock_points": 0,
                "is_open": 1,
                "sort_order": sort_order,
            }
        )

    for unlock_points, points, items in LOCKED_TIERS:
        for title, description, _ in items:
            sort_order += 1
            entries.append(
                {
                    "title": title,
                    "description": description,
                    "points": points,
                    "unlock_points": unlock_points,
                    "is_open": 0,
                    "sort_order": sort_order,
                }
            )

    return entries
