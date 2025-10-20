// Proxy for TheMealDB Dessert API
export async function GET(req) {
  const url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert";
  try {
    const res = await fetch(url);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch desserts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
