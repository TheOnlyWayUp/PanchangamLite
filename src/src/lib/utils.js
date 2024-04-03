export let compatability = {
    1: { name: 'Janma', status: 'Bad', score: -1 },
    2: { name: 'Sampath', status: 'Very Good', score: 2 },
    3: { name: 'Vipath', status: 'Bad', score: -1 },
    4: { name: 'Kshema', status: 'Good', score: 1 },
    5: { name: 'Pratyak', status: 'Very Bad', score: -2 },
    6: { name: 'Sadhana', status: 'Very Good', score: 2 },
    7: { name: 'Naidhana', status: 'Very Bad', score: -2 },
    8: { name: 'Mitra', status: 'Good', score: 1 },
    9: { name: 'Parama Mitra', status: 'Very Good', score: 2 },
}

export let nakshatralu = {
    Ashwini: 0,
    Magha: 0,
    Moola: 0,
    Bharani: 1,
    'Purva Phalguni': 1,
    'Purva Ashadha': 1,
    Krithika: 2,
    'Uttara Phalguni': 2,
    'Uttara Ashadha': 2,
    Rohini: 3,
    Hasta: 3,
    Shravana: 3,
    Mrigashirsha: 4,
    Chitra: 4,
    Dhanishta: 4,
    Ardra: 5,
    Swati: 5,
    Shatabhisha: 5,
    Punarvasu: 6,
    Vishaka: 6,
    'Purva Bhadrapada': 6,
    Pushya: 7,
    Anuradha: 7,
    'Uttara Bhadrapada': 7,
    Ashlesha: 8,
    Jyeshta: 8,
    Revati: 8
}

export let nakshatralu_to_compatibility = {
    0: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    1: [9, 1, 2, 3, 4, 5, 6, 7, 8],
    2: [8, 9, 1, 2, 3, 4, 5, 6, 7],
    3: [7, 8, 9, 1, 2, 3, 4, 5, 6],
    4: [6, 7, 8, 9, 1, 2, 3, 4, 5],
    5: [5, 6, 7, 8, 9, 1, 2, 3, 4],
    6: [4, 5, 6, 7, 8, 9, 1, 2, 3],
    7: [3, 4, 5, 6, 7, 8, 9, 1, 2],
    8: [2, 3, 4, 5, 6, 7, 8, 9, 1],
}

export function get_nakshatralu_compatability(birth_nakshatram, ruling_nakshatram) {
    let nakshatram_row = nakshatralu[birth_nakshatram]
    let nakshatram_column = nakshatralu[ruling_nakshatram]
    return nakshatralu_to_compatibility[nakshatram_row][nakshatram_column]
}

// ! Read more here - https://vijayalur.com/2011/10/02/tarabala-chandrabala-panchaka/

export function to_human_date(date) {
    // Thanks https://stackoverflow.com/a/71439534 !
    return new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })
        .format(date)
        .split(' ')
        .join('-')
}

export function is_in_time_range(date, start_date, end_date) {
    let year = date.getFullYear()
    start_date.setFullYear(year)
    end_date.setFullYear(year)

    // Thanks https://johnkavanagh.co.uk/articles/check-if-today-is-between-two-dates-in-javascript/
    return date > start_date && date < end_date;
}