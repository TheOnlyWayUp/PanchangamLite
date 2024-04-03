// ! Thanks https://joyofcode.xyz/sveltekit-loading-data#api-endpoints
// /api/newsletter GET
import jsdom from 'jsdom'

if (!String.prototype.strip) {
    // ! Thanks https://stackoverflow.com/a/20890838
    String.prototype.strip = function (string) {
        var escaped = string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        return this.replace(RegExp('^[' + escaped + ']+|[' + escaped + ']+$', 'gm'), '');
    };
}

export async function GET(event) {
    let url = `https://panchangam.org/global/daily.php?city=${event.url.searchParams.get("city") || 'Hyderabad'}&date=${atob(event.url.searchParams.get("date"))}`

    let response = await fetch(url)
    let html = await response.text()

    console.log(html)

    const { JSDOM } = jsdom

    let dom = new JSDOM(html)
    // Parse the text
    var doc = dom.window.document

    let table_body = doc.getElementsByClassName("table table-striped table-condensed")[0].children[0]
    let rows = Array.from(table_body.children)


    let city = rows[1].children[1].textContent

    let data_rows = rows.slice(7)

    let panchangam_data = []
    let break_loop = false
    data_rows.forEach((el, idx) => {
        if (!break_loop) {
            if (el.children.length == 1) {
                break_loop = true
                data_rows = data_rows.slice(idx + 1)
            } else {
                panchangam_data.push(el)
            }
        }
    })

    let nakshatralu = {}
    panchangam_data[1].children[1].innerHTML.split("<br>").forEach(el => {
        let [nakshatram, ...timing] = el.split(':'); // Thanks https://stackoverflow.com/a/61124857 !
        nakshatralu[nakshatram.strip(' ')] = timing.join(':').strip(' ')
    })

    break_loop = false
    let bad_times_data = []
    data_rows.forEach((el, idx) => {
        if (!break_loop) {
            if (el.children.length == 1) {
                break_loop = true
                data_rows = data_rows.slice(idx + 1)
            } else {
                bad_times_data.push(el)
            }
        }
    })

    let bad_times = {}  // Big thanks to https://stackoverflow.com/a/27955267 !
    bad_times_data.forEach(el => { let children = el.children; bad_times[children[0].textContent] = children[1].textContent })

    break_loop = false
    let good_times_data = []
    data_rows.forEach((el, idx) => {
        if (!break_loop) {
            if (el.children.length == 1) {
                break_loop = true
                data_rows = data_rows.slice(idx + 1)
            } else {
                good_times_data.push(el)
            }
        }
    })

    let good_times = {}
    good_times_data.forEach(el => { let children = el.children; good_times[children[0].textContent] = children[1].textContent })

    let data = {
        city: city,
        nakshatralu: nakshatralu,
        good_times: good_times,
        bad_times: bad_times
    };

    return new Response(JSON.stringify(data))
}