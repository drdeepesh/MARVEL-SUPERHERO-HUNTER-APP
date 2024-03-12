const publicKey = "35e6ca14afa6ebe5da1d71ca75589671";
const privateKey = "bf8ed6407d438eb5cb23d6e0f4f8d49780cf129d";

export default async function fetchHeroes() {
    let heroes = [];
    const ts = Date.now();
    const hash = CryptoJS.MD5(ts+privateKey+publicKey).toString();

    const result = await fetch(`https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`);
    const herosData = await result.json();
    heroes = herosData.data.results;
    return heroes;
}

fetchHeroes();
