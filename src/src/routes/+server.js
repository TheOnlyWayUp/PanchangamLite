// ! Thanks https://joyofcode.xyz/sveltekit-loading-data#api-endpoints
// /api/newsletter GET

export async function GET(event) {
    let url = `https://panchangam.org/global/daily.php?city=Hyderabad&date=${atob(event.url.searchParams.get("url"))}`
    let text = ""

    let response = await fetch(url)
    let html = await response.text()

    const options = {
        status: 200,
    }

    return new Response(html, options)
}