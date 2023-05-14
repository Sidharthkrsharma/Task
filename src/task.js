import React, { useState } from 'react';
import Chart from 'chart.js/auto';

const Fetch = () => {
  const [histogramData, setHistogramData] = useState([]);

  const handleSubmit = async () => {
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    const words = text.toLowerCase().match(/\b\w+\b/g);
    const frequency = {};
    words.forEach((word) => {
      frequency[word] = frequency[word] || 0;
      frequency[word]++;
    });

    const sortedWords = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
    const top20Words = sortedWords.slice(0, 20);
    const data = top20Words.map((word) => ({ word, frequency: frequency[word] }));
    setHistogramData(data);
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.word),
        datasets: [
          {
            label: 'Frequency',
            data: data.map((d) => d.frequency),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  };

  const handleExport = () => {
    const csv = 'Word,Frequency\n' + histogramData.map((d) => `${d.word},${d.frequency}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'histogram.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className='chart-container'>
      
      <button onClick={handleSubmit}>Submit</button>
      <canvas id="myChart" width="400" height="400"></canvas>
      {histogramData.length > 0 && <button onClick={handleExport}>Export</button>}
      
    </div>
  );
}

export default Fetch;