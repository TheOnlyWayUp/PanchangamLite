// ! Thanks https://joyofcode.xyz/sveltekit-loading-data#api-endpoints
// /api/newsletter GET

export async function GET(event) {
    let url = atob(event.url.searchParams.get("url"))
    let text = ""

    let response = await fetch(url)
    let html = await response.text()

    const options = {
        status: 200,
    }

    return new Response(html, options)
}