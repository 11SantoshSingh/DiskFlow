const colors = [
  '#0d6efd',
  '#198754',
  '#dc3545',
  '#fd7e14',
  '#6f42c1',
  '#20c997',
  '#e83e8c',
];

let runCount = 0;
let runsData = [];

function parseRequests(input) {
  return input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
}

function runSSTF(requests, head) {
  let seq = [head];
  let pending = [...requests];
  while (pending.length > 0) {
    pending.sort((a, b) => Math.abs(a - head) - Math.abs(b - head));
    let closest = pending.shift();
    seq.push(closest);
    head = closest;
  }
  return seq;
}

function runCSCAN(requests, head, diskSize = 200) {
  let seq = [head];
  let sorted = [...requests].sort((a, b) => a - b);
  let upper = sorted.filter(r => r >= head);
  let lower = sorted.filter(r => r < head);
  seq = seq.concat(upper, [diskSize - 1, 0], lower);
  return seq;
}

function runSCAN(requests, head, diskSize = 200) {
  let seq = [head];
  let sorted = [...requests].sort((a, b) => a - b);
  let upper = sorted.filter(r => r >= head);
  let lower = sorted.filter(r => r < head);
  seq = seq.concat(upper, [diskSize - 1], lower.reverse());
  return seq;
}

function runLOOK(requests, head) {
  let seq = [head];
  let sorted = [...requests].sort((a, b) => a - b);
  let upper = sorted.filter(r => r >= head);
  let lower = sorted.filter(r => r < head);
  seq = seq.concat(upper, lower.reverse());
  return seq;
}

function calcSeek(seq) {
  return seq.slice(1).reduce((acc, cur, i) => acc + Math.abs(cur - seq[i]), 0);
}

function animateHeadMovement(container, sequence, color) {
  container.innerHTML = "";
  sequence.forEach((val) => {
    const block = document.createElement("div");
    block.className = "head-block";
    block.innerText = val;
    block.style.backgroundColor = '#dee2e6';
    container.appendChild(block);
  });

  let blocks = container.children;
  let i = 0;
  const interval = setInterval(() => {
    Array.from(blocks).forEach(b => {
      b.classList.remove("active");
      b.style.color = 'black';
      b.style.backgroundColor = '#dee2e6';
    });
    if (i < blocks.length) {
      blocks[i].classList.add("active");
      blocks[i].style.color = 'white';
      blocks[i].style.backgroundColor = color;
      blocks[i].scrollIntoView({behavior: 'smooth', inline: 'center'});
      i++;
    } else {
      clearInterval(interval);
    }
  }, 700);
}

function addDashboardItem(algorithm, sequence, seekTime, color) {
  const dashboard = document.getElementById('dashboard');

  const container = document.createElement('div');
  container.className = 'dashboard-item';
  container.style.borderColor = color;
  container.style.color = color;

  const header = document.createElement('div');
  header.className = 'dashboard-header';
  header.innerHTML = `<h4>${algorithm.toUpperCase()} Result</h4>`;

  const info = document.createElement('p');
  info.style.whiteSpace = 'pre-line';
  info.innerText = `Sequence: ${sequence.join(" → ")}\nTotal Seek Time: ${seekTime}`;

  const animationDiv = document.createElement('div');
  animationDiv.className = 'head-animation';
  animationDiv.style.color = color;

  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  const canvas = document.createElement('canvas');
  chartContainer.appendChild(canvas);

  container.appendChild(header);
  container.appendChild(info);
  container.appendChild(animationDiv);
  container.appendChild(chartContainer);
  dashboard.appendChild(container);

  animateHeadMovement(animationDiv, sequence, color);

  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: sequence.map((_, i) => i),
      datasets: [{
        label: algorithm,
        data: sequence,
        borderColor: color,
        fill: false,
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Track Number'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Step'
          }
        }
      }
    }
  });

  // Save run data for comparison
  runsData.push({ algorithm, sequence, seekTime, color });
}

function runSelectedAlgorithm() {
  const head = parseInt(document.getElementById("head").value);
  const requests = parseRequests(document.getElementById("requests").value);
  const algorithm = document.getElementById("algorithm").value;

  if (isNaN(head)) {
    alert("Please enter a valid initial head position.");
    return;
  }
  if (requests.length === 0) {
    alert("Please enter at least one valid request.");
    return;
  }

  let sequence = [];
  switch (algorithm) {
    case "sstf": sequence = runSSTF(requests, head); break;
    case "cscan": sequence = runCSCAN(requests, head); break;
    case "scan": sequence = runSCAN(requests, head); break;
    case "look": sequence = runLOOK(requests, head); break;
    default:
      alert("Select a valid algorithm.");
      return;
  }

  const seekTime = calcSeek(sequence);
  const color = colors[runCount % colors.length];
  runCount++;

  addDashboardItem(algorithm, sequence, seekTime, color);
}

function clearDashboard() {
  document.getElementById('dashboard').innerHTML = '';
  runCount = 0;
  runsData = [];
}

function showComparisonModal() {
  if (runsData.length === 0) {
    alert("No runs to compare! Please simulate some algorithms first.");
    return;
  }
  const modalEl = document.getElementById('comparisonModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  const tbody = document.getElementById('comparisonTableBody');
  tbody.innerHTML = '';

  const maxLength = Math.max(...runsData.map(run => run.sequence.length));
  const labels = Array.from({ length: maxLength }, (_, i) => i);

  // Destroy old chart if exists
  if (window.comparisonChartInstance) {
    window.comparisonChartInstance.destroy();
  }

  const datasets = runsData.map(run => ({
    label: run.algorithm.toUpperCase(),
    data: labels.map(i => run.sequence[i] !== undefined ? run.sequence[i] : null),
    borderColor: run.color,
    fill: false,
    tension: 0.2,
    spanGaps: true,
    pointRadius: 3,
    pointHoverRadius: 5,
  }));

  const ctx = document.getElementById('comparisonChart').getContext('2d');
  window.comparisonChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { boxWidth: 12, padding: 15 }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Track Number'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Step'
          }
        }
      }
    }
  });

  // Fill comparison table
  runsData.forEach(run => {
    const tr = document.createElement('tr');
    tr.style.color = run.color;
    tr.innerHTML = `
      <td>${run.algorithm.toUpperCase()}</td>
      <td>${run.seekTime}</td>
      <td>${run.sequence.length}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Event listeners
document.getElementById('simulateBtn').addEventListener('click', runSelectedAlgorithm);
document.getElementById('clearBtn').addEventListener('click', clearDashboard);
document.getElementById('compareBtn').addEventListener('click', showComparisonModal);
