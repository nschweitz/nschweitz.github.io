const results_per_page = 50;
var startIndex = 0;
// All these `var`s get filled in later
var results = { columns: [], values: [] };
// Should be [(field, comparator, compare-to, custom)]
// Custom is when despite the user having selected a field with known options,
// they still chose to select "Custom" and type in a manual search.
var filters = [];
var fields = {};
var db;
const column_widths = {
    "model_name": "15ch",
    "body_material": "15ch",
    "strings": "6ch",
    "body_type": "15ch",
    "bridge": "15ch",
    "bridge_pickup": "15ch",
    "middle_pickup": "15ch",
    "neck_pickup": "15ch",
    "controls": "15ch",
    "fingerboard_inlays": "15ch",
    "fingerboard_material": "10ch",
    "finishes": "25ch",
    "frets": "4ch",
    "hardware_color": "15ch",
    "made_in": "10ch",
    "neck_type": "15ch",
    "neck_joint": "10ch",
    "neck_material": "20ch",
    "nut": "10ch",
    "pickguard": "10ch",
    "pickup_configuration": "15ch",
    "scale_length": "6ch",
    "sold_in": "10ch",
    "year_offered_start": "10ch",
    "year_offered_end": "10ch",
    "market_value": "8ch",
};

const numeric_comparators = ["<", "&le;", "=", "&ge;", ">"];
const string_comparators = ["Contains"];

const known_options = {
    "body_type": [
        "Acoustic",
        "Chambered",
        "Classical",
        "Hollow body",
        "Hollow body w/ florentine cutaway",
        "Semi-acoustic",
        "Semi-hollow",
        "Solid",
    ],
    "body_material": [
        "AAAAA flamed maple",
        "AAAAA quilted maple",
        "AAAAA tochu",
        "AAAA flamed maple",
        "AAAA quilted maple",
        "AAAA quilt maple",
        "AAA curly maple",
        "AAA flamed maple",
        "AAA quilted maple",
        "AA figured maple",
        "Abalone purfling",
        "Acrylic",
        "African mahogany",
        "African padauk",
        "Agathis",
        "Agatis",
        "Alder",
        "American basswood",
        "Arched",
        "Arched ash",
        "Arched birch",
        "Arched contoured maple",
        "Arched curly maple",
        "Arched flamed maple",
        "Arched mahogany",
        "Arched spruce",
        "Ash",
        "Australian blackwood",
        "Basswood",
        "Birch",
        "Birdseye maple",
        "Black binding",
        "Black limba",
        "Black pearl binding",
        "Blue resin",
        "Bocote",
        "Bubinga",
        "Buckeye burl",
        "Buninga",
        "Burl mahogany",
        "Camphor",
        "Campwood",
        "Carved curly maple",
        "Carved solid maple",
        "Cedar",
        "Cherry",
        "Chestnut",
        "Cinnamon",
        "Claro",
        "Claro walnut",
        "Contoured",
        "Contrast binding",
        "Corrugated walnut",
        "Cream binding",
        "Crystal cut",
        "Dark red resin",
        "Eastern curly maple",
        "Eucalyptus",
        "Exotic-grain rosewood",
        "Exotic maple",
        "Exotic quilted maple",
        "Facewood",
        "Figured and bookmatched redwood",
        "Figured birch",
        "Figured black walnut",
        "Figured bubinga",
        "Figured hawaiian koa",
        "Figured japanese persimmon",
        "Figured mahogany",
        "Figured maple",
        "Figured maple and panga panga",
        "Figured solid ash",
        "Flamed art grain",
        "Flamed ash",
        "Flamed maple",
        "Flamed maple on laminated mahogany",
        "Flamed maple veneer",
        "Flamed sapele",
        "Flame maple",
        "Full moon maple",
        "German carved maple",
        "Golden synthetic resin",
        "Gold plated solid brass",
        "Gold resin",
        "Gravure crocodile",
        "Gravure flame",
        "Gravure hard maple",
        "Gravure quilted maple",
        "Green epoxy resin",
        "Green resin",
        "Hard maple",
        "Hardwood",
        "Heart wood maple",
        "Honduran mahogany",
        "Horse chestnut burl",
        "Ivory",
        "Ivory binding",
        "Japanese horse chestnut",
        "Jelutong",
        "Karin",
        "Koa",
        "Korina",
        "Kralo walnut",
        "Lacewood",
        "Laminated mahogany",
        "Layered ash",
        "Layered swamp ash",
        "Ligh american maple",
        "Light american maple",
        "Light ash",
        "Light maple",
        "Limba",
        "Luthite",
        "Mahogany",
        "Maple",
        "Meranti",
        "Monkey pod",
        "Myrtle",
        "Nato",
        "Nyatoh",
        "Okoume",
        "Orange resin",
        "Ovangkol",
        "Padauk",
        "Paisley motif",
        "Panga panga",
        "Pearl inlays",
        "Pearloid binding",
        "Plywood",
        "Poplar",
        "Poplar burl",
        "Popular burl",
        "Purpleheart",
        "Purple resin",
        "Quilted ash",
        "Quilted binding",
        "Quilted maple",
        "Quilted sapele",
        "Red resin",
        "Red tortoiseshell",
        "Resin-filled buckeye burl",
        "Resoncast",
        "Richlite ",
        "Rosewood",
        "Saman",
        "Sandblasted ash",
        "Sapele",
        "Sapele walnut",
        "Selected AAA north american flamed maple",
        "Selected birch",
        "Selected exotic maple",
        "Selected quilted maple",
        "Selected spalted maple",
        "Sen",
        "Silky oak",
        "Soft flame maple",
        "Soft maple",
        "Solid ash",
        "Solid mahogany",
        "South african mahogany",
        "Spalted maple",
        "Spalted wood",
        "Stainless steel",
        "Striped maple",
        "Swamp ash",
        "Tamo ash",
        "Thick maple",
        "Tineo",
        "Transparent plastic",
        "Walnut",
        "Wenge",
        "White binding",
        "Wood leaf inlays",
        "Zebra wood",
        "Zebrawood",
        "Zinc-coated mahogany",
        "Ziricote",
    ],
    "bridge": [
        "2-point",
        "3-point",
        "5050",
        "ABM 3210",
        "Accu-cast",
        "Accu-cast B",
        "Accu-cast B10",
        "Accu-cast B100",
        "Accu-cast B105",
        "Accu-cast B106",
        "Accu-cast B120",
        "Accu-cast B125",
        "Accu-cast B126",
        "Accu-cast B15",
        "Accu-cast B16",
        "Accu-cast B20",
        "Accu-cast B200",
        "Accu-cast B205",
        "Accu-cast B25",
        "Accu-cast B300",
        "Accu-cast B300p",
        "Accu-cast B305",
        "Accu-cast B305p",
        "Accu-cast B306",
        "Accu-cast B500",
        "Accu-cast B505",
        "Accu-cast B506",
        "Accu cast B-II",
        "Accu-cast B-IV",
        "Accu-cast IV",
        "Accu tune II",
        "ACT",
        "ART-1",
        "ART-12",
        "ART-1 Tune-o-matic",
        "ART-2",
        "ART-2 roller",
        "ART-7W",
        "Artcore",
        "Art-ST",
        "Art-W",
        "Ashtray",
        "ATK4",
        "ATK5",
        "AXB special",
        "B10",
        "B100",
        "B105",
        "B106",
        "B15",
        "B15w",
        "B16",
        "B405",
        "Bigsby",
        "Die-cast",
        "Double Edge",
        "Double Edge Pro",
        "Double Edge Pro for Roland GK",
        "Double Lo-Pro Edge",
        "EB10",
        "EB-5",
        "EB-7",
        "Edge",
        "Edge II",
        "Edge III",
        "Edge Pro",
        "Edge Pro II",
        "Edge Zero",
        "Edge Zero II",
        "Evertune",
        "F106",
        "F107",
        "F108",
        "FAT-10",
        "FAT-20",
        "FAT-6",
        "FAT6",
        "Fixed",
        "Fixed Edge III",
        "Fixed Lo-Pro edge",
        "Full action II",
        "Full tune",
        "Full tune II",
        "Full tune III",
        "FXB50",
        "FX Edge III",
        "GB100",
        "GB2K ebony",
        "GB5 custom",
        "GBSP10 special",
        "Gibraltar",
        "Gibraltar 1",
        "Gibraltar Artist",
        "Gibraltar Custom",
        "Gibraltar Elite",
        "Gibraltar II",
        "Gibraltar III",
        "Gibraltar Performer",
        "Gibraltar Plus",
        "Gibraltar Standard",
        "Gibraltar Standard ii",
        "Gibraltar Tune-o-matic",
        "Gibson EB",
        "Gotoh",
        "Gotoh 203B-4",
        "Gotoh 510AT",
        "Gotoh 510BN",
        "Gotoh Custom T.O.M",
        "Gotoh F1803",
        "Gotoh GE103B",
        "Gotoh GE103B-T",
        "Gotoh GTB100 wraparound",
        "Gotoh GTC101",
        "Gotoh GTC107",
        "Gotoh GTC12",
        "Gotoh GTC202",
        "Gotoh T1502",
        "Gotoh T1502S",
        "Gotoh T1527S",
        "Gotoh T1572S",
        "Gotoh T1702B",
        "Gotoh T1802",
        "Gotoh T1872S",
        "Graphite 510BR-5",
        "GTC101",
        "GTC-7",
        "GTC Jr.",
        "Hard rocker",
        "Hard rocker pro",
        "Harmono-matic",
        "HB-4",
        "HB-5",
        "HB flat mount",
        "Headless",
        "Hipshot",
        "HQ",
        "HQ-J",
        "Ibanez FX8",
        "Ibanez MR-2",
        "Ibanez T102",
        "Ibanez T106",
        "Ibanez TZ80",
        "IFX10",
        "IFX-Pro",
        "ILT1",
        "ILT1 DL",
        "ITL-10",
        "ITL-Pro",
        "Jazzmaster",
        "Lo-B 4",
        "Lo-Pro Edge",
        "Lo-TRS",
        "Lo-TRS II",
        "LR10 special",
        "Lyre vibrola",
        "Mono-rail",
        "Mono-rail 5S",
        "Mono-rail II",
        "Mono-rail III",
        "Mono-rail IV",
        "Mono-rail V",
        "Mono-rail VS",
        "Mono-tune",
        "MR-2",
        "MR-4",
        "MR5P",
        "MR-5S",
        "OGE1086TFB",
        "Omni-adjust",
        "Powerocker",
        "Powerocker DX",
        "Powerocker II",
        "Powerocker SPECIAL",
        "Pro rock'r",
        "SAT-10",
        "SAT-30",
        "SAT-30S",
        "SAT-30SX",
        "Sat Pro",
        "Sat Pro II",
        "Schroeder stoptail",
        "Short stop",
        "Short stop II",
        "Short stop III",
        "Single locking",
        "SLT101",
        "SLT101 SL",
        "Spider-style resonator",
        "ST",
        "ST30",
        "Standard",
        "Standard 6-point",
        "Standard DL",
        "Standard IV",
        "Standard Lo-B4",
        "Standard Tune-o-matic",
        "Standard V",
        "Starfield SF10",
        "Starfield SF5",
        "Steinberger",
        "STN50",
        "Stop-bar",
        "Strat hardtail",
        "String-through six saddle",
        "Synchronized",
        "Synchronizr",
        "T102",
        "T106",
        "T1502",
        "T1502s",
        "T1702b",
        "T1802",
        "Tight-end",
        "Tight-end R",
        "Tight tune",
        "Tonepros",
        "Top load",
        "TP-J6",
        "TRS-101",
        "TRS505",
        "TRS505",
        "TRT-1",
        "TT50",
        "TT80",
        "Tune-o-matic",
        "TZ",
        "TZ-100",
        "TZ-30",
        "TZ-5",
        "TZ-6",
        "TZ-80",
        "TZ-II",
        "VFT2",
        "Vibrato",
        "Wilkinson",
        "Wilkinson VS100G",
        "Wilkinson VSV",
        "Wilkinson WK5",
        "Wilkinson WV6-SB",
        "WK10",
        "ZR",
        "ZR2",
    ],
    "fingerboard_inlays": [
        '3 abalone ovals at 12 fret and side dots',
        '3-color disappearing pyramid',
        '90th anniversary',
        'Abalone',
        'Abalone side dots',
        '"Ace"',
        'Aged',
        'Ajd special',
        'Apex',
        'Ar special',
        'Art120 special',
        'Artcore dx',
        'Artcore dx block',
        'Art special',
        'Art special at 12th fret',
        'At special',
        'Autumn leaves inlay',
        'Barbed wire',
        'Beaten path',
        'Bisected triangle',
        'Black',
        'Black pearl',
        'Block',
        'Blood vessel pattern',
        'Blue',
        'Blue DNA',
        'Blue resin',
        'Brass',
        'Brown mirror',
        'Bwm special pearl vine',
        'Cancer symbol',
        'Cherry blossom',
        'Claw marks',
        'Clay',
        'Colored',
        'Color-matched',
        'Compass',
        'Cream',
        'Crystal of snow inlay',
        'Custom',
        'Custom CT',
        'Custom made',
        'Custom mirror design',
        'Custom scroll',
        'Decorative',
        'Deluxe',
        'Descending size',
        'Diamond',
        'Disappearing pyramid',
        'DN block',
        'Dot',
        'Dot-oval-dot pattern',
        'F5 ornate',
        'Fancy',
        'Fancy intricate inlays',
        'Fgm block',
        'Fireworks',
        'Flame',
        'Floral',
        'Fluorescent green',
        'Fret lines',
        'Gb40thii special',
        'Gb40th special',
        '"George Benson"',
        'Glow in the dark',
        'Gold',
        'Gold flake',
        'Gold mirror',
        'Green',
        'Heartbeat',
        '"Hurricane"',
        'Ibanez checkmark',
        'Iron cross',
        'Ivory',
        'Jigsaw design',
        '"Joe satriani"',
        'Joe satriani inlay',
        '"JS custom"',
        'K5 logo',
        'K-7',
        '"Kumogara" cloud design',
        'Lightning',
        'Limited edition',
        '"Limited reissue"',
        'Luminescent',
        'Luminlay side dots',
        'Matching color dot',
        'Mdb logo',
        'Metallic',
        'Mexican abalone',
        'Moon',
        'Mother of pearl',
        'None',
        'Oblong pearloid blocks ',
        'Offset bar',
        'Off-set dot',
        'Offset stadium',
        'Offset triangle',
        '"Open beak"',
        'Ornate rose thorn pattern',
        'Oval',
        'Painted side fret marks',
        'Parallelogram',
        '"Paul Stanley" inlay',
        'Pearloid',
        'Pearloid dot',
        'Pearloid oval',
        'Pgb special',
        'Pia blossom',
        'Pib special',
        'Pink resin',
        'Pm3c acrylic',
        'Prb special circled star',
        'Prestige inlay',
        '"PS10LTD"',
        'Purple resin',
        'Quadrilateral',
        'Reaper',
        'Rectangle',
        'Red crystal rectangle',
        'Red scars',
        'Reverse sharktooth',
        'Sas special',
        'Screw head',
        'Scroll',
        'Shark fin',
        'Sharktooth',
        'Silver',
        '"Since 1987" inlay',
        'Skeleton grip',
        'Small dot',
        'Smoke mirror sharktooth',
        'Snowflake',
        'Southern cross',
        'Sparkle',
        'Special',
        'Special crescent moon inlay',
        'Special cross',
        'Special flames',
        'Special jbm inlay',
        'Special "seven"',
        'Spine',
        'Splashing wave',
        'Split block',
        'Split ovals',
        'Split parallelogram',
        'S prestige',
        'Squid',
        'Stainless steel',
        'Star',
        'Step offset',
        'Steve vai',
        '"Super edition"',
        'SV prestige',
        'S wave',
        'Three color',
        'Tree of death',
        'Tree of life',
        'Tribal acrylic',
        'Vine',
        'Vintage vine',
        'V marks',
        'Wedge sharktooth',
        'White',
        'White side dots',
        'Wood diamonds',
        '"X"',
        'Yellow',
    ],
    "neck_type": [
        "AB4",
        "AD",
        "AF207",
        "AF artcore",
        "AF artstar prestige",
        "AFB4",
        "AFBV4",
        "AFC",
        "AF expressionist",
        "AFJ",
        "AFJ7",
        "AFJ artcore dX",
        "AFR4",
        "AFR5",
        "AG artcore",
        "AGB4",
        "AGB5",
        "AGBV4",
        "AGBV5",
        "AG expressionist",
        "AGS artcore",
        "AH",
        "AJD",
        "AKJ",
        "AM",
        "AM artcore",
        "AM artstar",
        "AM expressionist",
        "AMF artcore",
        "ANB5",
        "ANB6",
        "APEX",
        "APEX2",
        "APEX prestige",
        "AR",
        "AR250/200",
        "ARC",
        "ARC DX",
        "AR chambered",
        "AR prestige",
        "ART",
        "Artcore",
        "Artfield",
        "Artist",
        "Artstar",
        "ARX",
        "ARZ",
        "AS",
        "Ashula",
        "AT",
        "AT100",
        "ATK",
        "ATZ",
        "AX",
        "AZ",
        "AZES",
        "Blazer",
        "BTB",
        "BWM",
        "C",
        "CBM",
        "CLM",
        "CMM",
        "Concert",
        "CT",
        "D",
        "DCM",
        "Destroyer",
        "DMM",
        "DN",
        "DT",
        "DTB",
        "DWB",
        "DWB35",
        "Dyuke",
        "EDA",
        "EDB",
        "EDC",
        "EDR",
        "EGEN",
        "EHB",
        "EKM",
        "EX",
        "EX100",
        "EXB4",
        "EXB5",
        "Expressionist",
        "EX Pro",
        "FA",
        "FAT AZ oval C",
        "FG",
        "Fireman",
        "FLATV",
        "FRM",
        "FRM350",
        "FTM",
        "GART",
        "GAX",
        "GAX1",
        "GAX2",
        "GAXB",
        "GB10",
        "GB100",
        "GB12",
        "GB15",
        "GB30",
        "GB5",
        "GDTM",
        "GFR",
        "GICM",
        "GR",
        "GRG",
        "GRG1",
        "GRG2",
        "GRGA",
        "GRGM",
        "GRGR",
        "Grooveline",
        "GRX",
        "GS",
        "GSA",
        "GSR",
        "GSRM",
        "GSRX",
        "GSZ",
        "GTR",
        "GVB",
        "GWB",
        "GXR",
        "Half round",
        "IBC",
        "IC",
        "ICB4",
        "Iceman",
        "IJXB4",
        "IMG",
        "JBBM",
        "JBM",
        "JCRG",
        "JCS14C01",
        "JEM",
        "JIVA",
        "JP20",
        "JPM",
        "JS",
        "JS100",
        "JSM Artstar",
        "JSM Prestige",
        "JS Premium",
        "JS Prestige",
        "JTK",
        "JTK1",
        "JTK2",
        "K5",
        "K7",
        "KIKO",
        "LB",
        "LE",
        "LGB30",
        "LGB300",
        "LR10",
        "M80M",
        "M8M",
        "Maxxas",
        "MBM",
        "MDB",
        "MFM",
        "MMM",
        "MSM",
        "Musician",
        "NDM",
        "Nitro",
        "ORM",
        "Parallel Wizard",
        "Performer",
        "PGB",
        "PGM Mikro",
        "PGM Premium",
        "PGM Prestige",
        "PIA",
        "PIB",
        "PM",
        "PM20",
        "PM Prestige",
        "PRB4",
        "PRO LINE",
        "PS",
        "PS40",
        "PS60",
        "PS Mikro",
        "PS Prestige",
        "PS Standard",
        "PWM",
        "RB700",
        "RB800",
        "RBM",
        "RC",
        "RD",
        "RG140",
        "RG2011SC",
        "RG3XX",
        "RGB",
        "RGCTM1",
        "RGKP",
        "RGV classic-plus",
        "Roadstar",
        "Roadstar DX",
        "Roadster",
        "Rocket Roll",
        "RS Custom",
        "RS Deluxe",
        "RX",
        "S",
        "SA",
        "SAS",
        "SB",
        "SC",
        "SC Ultra",
        "SDB",
        "SDGB",
        "SOFT-V",
        "SR",
        "SRA",
        "SRC",
        "SRD",
        "SRF",
        "SRFF",
        "SRH",
        "SR-II",
        "SRMD",
        "SRMS",
        "SRSC",
        "SRT",
        "SRX",
        "Stagemaster",
        "Stagestar",
        "Studio",
        "Super Wizard",
        "SV Classic-plus",
        "SZ",
        "SZR",
        "Talman",
        "TAM8",
        "TCB",
        "Titanium rod",
        "TMB",
        "TMB30",
        "TMB35",
        "TQM",
        "TR",
        "U",
        "UB",
        "UCEW",
        "UCGR",
        "Ultra",
        "USRG",
        "UV",
        "Viper",
        "VM1",
        "VWB",
        "Wizard",
        "Wizard II",
        "Wizard III",
        "Wizard IV",
        "Wizard Mikro",
        "Wizard Multiscale",
        "Wizard Premium",
        "Wizard Prestige",
        "Wizard Special",
        "X",
        "XV",
        "YY",
    ],
    "neck_material": [
        "1-piece",
        "2-piece",
        "3-piece",
        "5-piece",
        "7-piece",
        "9-piece",
        "11-piece",
        "15-piece",
        "African mahogany",
        "Amaranth",
        "Birch",
        "Birdseye maple",
        "Black walnut",
        "Bolivian rosewood",
        "Bubinga",
        "Eastern white maple",
        "Flamed maple",
        "Gfrp reinforcement",
        "Granadillo",
        "Hard",
        "Hard rock maple",
        "Honduras mahogany",
        "Jatoba",
        "Korina",
        "Laminated birch",
        "Mahogany",
        "Mahogany selected",
        "Maple",
        "Meranti",
        "Nato",
        "Nyatoh",
        "Okoume",
        "Paduak",
        "Painted",
        "Panga panga",
        "Pau ferro",
        "Purpleheart",
        "Quartersawn",
        "Roasted flamed maple",
        "Roasted maple",
        "Rock maple",
        "Rosewood",
        "Sapele",
        "Selected rosewood",
        "S-tech roasted birdseye maple",
        "S-tech roasted flamed maple",
        "S-tech roasted maple",
        "Super wood",
        "Thermo-aged african mahogany",
        "Thermo-aged mahogany",
        "Thermo-aged nyatoh",
        "Timeless timber",
        "Titanium rods",
        "Walnut",
        "Wenge",
    ],
};

function addFilter() {
    filters.push(["model_name", "Contains", "", false])

    updateFilters();
    updateResults();
    updateTable();
}

function updateFilters() {
    const div = document.getElementById("filters");
    div.innerHTML = "";

    filters.forEach(function (filter, index) {
        [filter_field, existing_comp, compare_to, is_custom] = filter;

        const inner_div = document.createElement("div");

        // Field selector
        const field_select = document.createElement("select");
        Object.keys(fields).forEach(function (field) {
            const option = document.createElement("option");
            option.text = field_name_humanify(field);
            option.value = field;

            if (field === filter_field) {
                option.selected = true;
            }

            field_select.appendChild(option);
        });

        inner_div.appendChild(field_select);

        // Hook to change `filters` when user selects a new field
        field_select.onchange = function() {
            filters[index][0] = field_select.value;

            const type = fields[field_select.value];
            if (type === "REAL" || type === "INTEGER") {
                filters[index][1] = "=";
            } else {
                filters[index][1] = "Contains";
            }

            // Make sure we set compare_to and custom to the right value
            if (filters[index][0] in known_options) {
                filters[index][2] = "";
                filters[index][3] = true;
            }

            updateFilters();
            updateResults();
            updateTable();
        };

        // Comparison selector
        const type = fields[field_select.value];
        var comparators = [];
        if (type === "REAL" || type === "INTEGER") {
            comparators = numeric_comparators;
        } else {
            comparators = string_comparators;
        }

        const comp_select = document.createElement("select");
        comparators.forEach(function (comp) {
            const option = document.createElement("option");
            option.innerHTML = comp;
            option.value = comp;

            if (comp === existing_comp) {
                option.selected = true;
            }

            comp_select.appendChild(option);
        });

        inner_div.appendChild(comp_select);

        // Hook to update `filters` when user selects a new comparison
        comp_select.onchange = function() {
            filters[index][1] = comp_select.value;

            updateResults();
            updateTable();
        };

        if (filters[index][0] in known_options) {
            // Dropdown for strings with known possibilities
            const known_select = document.createElement("select");

            const custom = document.createElement("option");
            custom.innerHTML = "Custom...";
            known_select.appendChild(custom);

            const options = known_options[filters[index][0]];
            options.forEach(function (option_name) {
                const option = document.createElement("option");
                option.innerHTML = option_name;
                known_select.appendChild(option);
            });

            // Fill in the correct currently selected option
            if (filters[index][3]) {
                // Custom compare_to
                known_select.value = "Custom...";
            } else {
                // Fixed option, so selector should reflect what's in `filters`
                known_select.value = filters[index][2];
            }

            inner_div.appendChild(known_select);

            const updateSelect = () => {
                if (known_select.value === "Custom...") {
                    filters[index][2] = "";
                    filters[index][3] = true;
                } else {
                    filters[index][2] = known_select.value;
                    filters[index][3] = false;
                }

                updateFilters();
                updateResults();
                updateTable();
            };

            known_select.onchange = updateSelect;
        }

        // Custom input field - show either when there are no known options or
        // the user has selected "Custom"
        if (!(filters[index][0] in known_options) || is_custom) {
            const input = document.createElement("input");
            input.value = filters[index][2];

            if (type === "REAL" || type === "INTEGER") {
                input.type = "number";
            }

            input.addEventListener("input", function(event) {
                filters[index][2] = event.target.value;
                updateResults();
                updateTable();
            });

            inner_div.appendChild(input);
        }

        // Remove button
        const remove = document.createElement("button");
        remove.innerHTML = "<b>X</b>";
        remove.classList.add("remove-button");

        remove.onclick = function() {
            filters.splice(index, 1);

            updateFilters();
            updateResults();
            updateTable();
        };

        inner_div.appendChild(remove);

        div.appendChild(inner_div);
    });
}

function updatePagingButtons() {
    updatePagingButtonsHelper("page-buttons-top", results, startIndex);
    updatePagingButtonsHelper("page-buttons-bottom", results, startIndex);
}

function updatePagingButtonsHelper(id) {
    const div = document.getElementById(id);
    div.innerHTML = "";

    // Styling the buttons
    div.style.display = "flex";
    //div.style.justifyContent = "center";
    div.style.marginTop = "20px";
    div.style.gap = "10px";

    const totalPages = Math.ceil(results.values.length / results_per_page);
    const currentPage = Math.floor(startIndex / results_per_page) + 1;

    const createButton = (text, onClick, isActive = false) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add("pagebutton");
        if (isActive) {
            button.classList.add("active");
        }

        button.addEventListener("click", onClick);

        return button;
    };

    /*
    // First page button
    if (currentPage > 3) {
        const firstButton = createButton("1", () => {
            startIndex = 0;
            updateTable();
            window.scrollTo(0, 0);
        });
        div.appendChild(firstButton);

        if (currentPage > 4) {
            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.style.padding = "10px 15px";
            div.appendChild(dots);
        }
    }

    // Centered page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createButton(
            i.toString(),
            () => {
                startIndex = (i - 1) * results_per_page;
                updateTable();
                window.scrollTo(0, 0);
            },
            i === currentPage
        );
        div.appendChild(pageButton);
    }

    // Last page button
    if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.style.padding = "10px 15px";
            div.appendChild(dots);
        }

        const lastButton = createButton(totalPages.toString(), () => {
            startIndex = (totalPages - 1) * results_per_page;
            updateTable();
            window.scrollTo(0, 0);
        });
        div.appendChild(lastButton);
    }
    */

    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;

        const button = createButton(i.toString(), () => {
            startIndex = (i - 1) * results_per_page;
            updateTable();
            window.scrollTo(0, 0);
        }, isActive);

        div.appendChild(button);
    }
}

function updateResultCount() {
    const counter = document.getElementById("results-text");

    if (results.length === 0) {
        counter.innerHTML = "No results.";
        return;
    }

    const first_result = startIndex + 1;
    var last_result = startIndex + results_per_page;
    if (last_result > results.values.length) {
        last_result = results.values.length;
    }

    counter.innerHTML = "Showing " + first_result + " to " + last_result + " of " + results.values.length + " results. All data from the excellent <a href='https://ibanez.fandom.com/wiki/Ibanez_Wiki'>Ibanez Wiki</a>.";
}

function field_name_humanify(field_name) {
    return field_name.split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
}

function updateTable() {
    const table = document.getElementById("my-table");
    table.innerHTML = "";

    // Add column names
    const column_name_row = document.createElement("tr");
    table.appendChild(column_name_row);

    // Empty column for expand buttons
    const empty_column = document.createElement("th")
    empty_column.width = "10em";
    empty_column.classList.add("invisible");
    column_name_row.appendChild(empty_column);

    results.columns.forEach(function (column_name) {
        const th = document.createElement("th");
        th.innerHTML = field_name_humanify(column_name);
        th.style.width = column_widths[column_name];
        column_name_row.appendChild(th);
    });

    // Add values
    for (var offset = 0; offset < results_per_page; offset++) {
        if (startIndex + offset >= results.values.length) {
            break; // All rows have been added
        }

        const row_values = results.values[startIndex + offset];
        const tr = document.createElement("tr");

        const expand_cell = document.createElement("td");
        expand_cell.innerHTML = "↕";
        expand_cell.classList.add("invisible");
        tr.appendChild(expand_cell);

        row_values.forEach(function (value) {
            const td = document.createElement("td");
            td.innerHTML = value;
            tr.appendChild(td);
        });

        table.appendChild(tr);
    }

    updatePagingButtons();
    updateResultCount();
    addTableWrappingToggle(table);
}

// Makes it so you can toggle between wrapping and cutoff by clicking on a row
function addTableWrappingToggle(table) {
    // Add click event listener to each row in tbody
    table.querySelectorAll('tr').forEach(function(row) {
        row.firstElementChild.addEventListener('click', function() {
          // Toggle the 'wrap-text' class on the clicked row
          row.classList.toggle('wrap-text');
        });
    });
}

function updateResults() {
    var query = "SELECT model_name, body_type, strings, frets, body_material, scale_length, made_in, market_value, finishes, year_offered_start, year_offered_end, bridge, neck_type, controls, fingerboard_inlays, fingerboard_material, hardware_color, neck_joint, neck_material, nut, sold_in, pickguard, pickup_configuration, bridge_pickup, middle_pickup, neck_pickup FROM guitars WHERE ";

    filters.forEach(function ([field, comparator, compare_to]) {
        if (comparator === "Contains") {
            query += field + " LIKE '%" + compare_to + "%' AND ";
        } else if (comparator === "<" || comparator === ">" || comparator === "=") {
            // The 0 prepended to compare_to makes sure it's always a valid
            // number, even if compare_to is currently empty. Not the cleanest
            // solution...
            query += field + " " + comparator + " 0" + compare_to + " AND ";
        } else if (comparator === "&le;") {
            query += field + " <= 0" + compare_to + " AND ";
        } else if (comparator === "&ge;") {
            query += field + " >= 0" + compare_to + " AND ";
        }
    });

    // Make final AND syntactically correct
    query += "1=1;"

    results = db.exec(query)[0];

    if (results === undefined) {
        results = { columns: [], values: [] };
    }

    // Make sure we're not at a page that doesn't exist
    if (startIndex >= results.values.length) {
        startIndex = 0;
    }

    updateTable();
}

async function loadDatabase() {
    // Fetch the compressed SQLite file
    const response = await fetch('guitars.db.gz');
    const compressedData = await response.arrayBuffer();

    // Decompress the data
    const decompressedData = new Uint8Array(pako.ungzip(new Uint8Array(compressedData)));

    // Initialize sql.js with the database
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });
    db = new SQL.Database(decompressedData);

    // Example Query
    results = db.exec("SELECT model_name, body_type, strings, frets, body_material, scale_length, made_in, market_value, finishes, year_offered_start, year_offered_end, bridge, neck_type, controls, fingerboard_inlays, fingerboard_material, hardware_color, neck_joint, neck_material, nut, sold_in, pickguard, pickup_configuration, bridge_pickup, middle_pickup, neck_pickup FROM guitars")[0];

    db.exec("PRAGMA table_info(guitars);")[0]
        .values
        // Drop "id"
        .slice(1)
        .forEach(function (el) {
            // Name and type
            const field_name = el[1];
            const field_type = el[2];
            fields[field_name] = field_type;
        });

    updateTable();
}

loadDatabase();
