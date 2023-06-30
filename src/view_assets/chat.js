async function chat(accessToken) {
    axios.defaults.headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    }
    axios.defaults.baseURL = "/api/v1";

    document.getElementById("login").remove();
    const root = document.getElementById("root");

    axios.get("/user/info")
        .then((res) => {
            const p = document.createElement("h1");
            p.innerHTML = `Your Full Name: ${res.data.fullName}`;
            root.appendChild(p);
        }).catch((error) => {
            alert("Error: " + error);
        });
}