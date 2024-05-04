async function fetchData() {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        sessionStorage.setItem('cryptoData', JSON.stringify(data));
        renderData(data);
    } catch (error) {
        console.error(error);
    }
}

function renderData(data) {
    const tableBody = document.getElementById('datafromapi');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" width="50"></td>
            <td>${item.name}</td>
            <td>${item.symbol.toUpperCase()}</td>
            <td>$${formatvalue(item.current_price)}</td>
            <td>$${formatvalue(item.total_volume)}</td>
            <td class="percentage ${item.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">${item.price_change_percentage_24h.toFixed(2)}%</td>
            <td>Mkt Cap: $${formatvalue(item.market_cap)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function formatvalue(marketCap) {
    return marketCap.toLocaleString('en-US', {maximumFractionDigits: 0});
}

document.getElementById('searchInput').addEventListener('input', () => {
    const searchTerm = document.getElementById('searchInput').value;
    const data = JSON.parse(sessionStorage.getItem('cryptoData'));
    const filteredData = filterData(searchTerm, data);
    renderData(filteredData);
});

function filterData(searchTerm, data) {
    if (!searchTerm) return data;
    searchTerm = searchTerm.toLowerCase();
    return data.filter(item => item.name.toLowerCase().includes(searchTerm) || item.symbol.toLowerCase().includes(searchTerm));
}

function sortData(sortBy) {
    const data = JSON.parse(sessionStorage.getItem('cryptoData'));
    let sortedData = [];

    if (sortBy === 'marketCap') {
        sortedData = data.sort((a, b) => b.market_cap - a.market_cap);
    } else if (sortBy === 'percentageChange') {
        sortedData = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    }

    renderData(sortedData);
}

fetchData();
