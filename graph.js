// URL de l'API
const API_URL = 'https://api.example.com/weather';

// Fonction pour récupérer les données depuis l'API
async function fetchData() {
  try {
    const response = await fetch(API_URL); // Requête HTTP GET
    const data = await response.json(); // Conversion en JSON
    return data; // Retourner les données récupérées
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
}

// Initialisation des graphiques
async function initCharts() {
  const data = await fetchData(); // Récupérer les données depuis l'API

  if (!data) {
    console.error('Pas de données disponibles.');
    return;
  }

  // Création des graphiques
  const charts = [
    {
      element: 'chart1',
      label: 'Température (°C)',
      data: data.temperature, // Température
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      unit: '°C'
    },
    {
      element: 'chart2',
      label: 'Vitesse du Vent (km/h)',
      data: data.wind_speed, // Vitesse du vent
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      unit: 'km/h'
    },
    {
      element: 'chart3',
      label: 'Précipitations (mm)',
      data: data.precipitation, // Précipitations
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      unit: 'mm'
    }
  ];

  // Création des graphiques avec Chart.js
  charts.forEach(set => {
    const ctx = document.getElementById(set.element).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels, // Labels provenant de l'API
        datasets: [{
          label: set.label,
          data: set.data, // Données spécifiques
          borderColor: set.borderColor,
          backgroundColor: set.backgroundColor,
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.raw} ${set.unit}`; // Ajouter l'unité dans les infobulles
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: set.unit // Unité sur l'axe Y
            }
          }
        }
      }
    });
  });
}

// Mettre à jour les données périodiquement
async function updateCharts() {
  const data = await fetchData(); // Récupérer de nouvelles données
  if (!data) {
    console.error('Pas de nouvelles données disponibles.');
    return;
  }

  // Mettre à jour chaque graphique
  ['chart1', 'chart2', 'chart3'].forEach((chartId, index) => {
    const chart = Chart.getChart(chartId); // Récupérer le graphique existant
    if (chart) {
      chart.data.labels = data.labels; // Mettre à jour les labels
      chart.data.datasets[0].data = [
        data.temperature,
        data.wind_speed,
        data.precipitation
      ][index]; // Mettre à jour les données en fonction du graphique
      chart.update(); // Redessiner
    }
  });
}

// Initialiser les graphiques au chargement de la page
initCharts();

// Mettre à jour les graphiques toutes les 5 minutes
setInterval(updateCharts, 5 * 60 * 1000);
