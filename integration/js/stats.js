/* ============================================================
   使用统计：fetch 加载本地 data/data.json
   复用课堂六的图表代码：ECharts 柱状图 + 加载中/失败/空数据三态
   图内包含标题、单位与数据来源
   ============================================================ */

const DATA_URL = 'data/data.json';

const statusEl = document.getElementById('chartStatus');
const metaEl = document.getElementById('metaNote');

let usageChart = null;

// 统一状态提示：type 取 loading / error / empty
const showStatus = (type, html) => {
  statusEl.classList.remove('d-none', 'alert-info', 'alert-danger', 'alert-secondary');
  if (type === 'loading') {
    statusEl.classList.add('alert-info');
    statusEl.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>' + html;
  } else if (type === 'error') {
    statusEl.classList.add('alert-danger');
    statusEl.innerHTML = html;
  } else {
    statusEl.classList.add('alert-secondary');
    statusEl.innerHTML = html;
  }
};

const hideStatus = () => statusEl.classList.add('d-none');

// 空数据/失败时销毁已有图表，避免残留旧图形
const disposeChart = () => {
  if (usageChart !== null) {
    usageChart.dispose();
    usageChart = null;
  }
};

// ECharts 柱状图：各自习室使用量
const renderChart = (data) => {
  if (usageChart === null) {
    usageChart = echarts.init(document.getElementById('usageChart'));
  }

  const rooms = data.rooms;

  // 第二参 true：不与旧 option 合并
  usageChart.setOption({
    title: {
      text: data.title,
      // 检查点要求：单位与数据来源标注在图内副标题
      subtext: '统计周期：' + data.period
        + '｜单位：' + data.unit
        + '｜数据来源：' + data.source,
      left: 'center',
      textStyle: { fontSize: 17 }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (value) => value + ' ' + data.unit
    },
    grid: { left: 55, right: 30, top: 95, bottom: 80, containLabel: true },
    xAxis: {
      type: 'category',
      data: rooms.map((room) => room.name),
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: data.unit,
      minInterval: 1
    },
    series: [
      {
        name: '使用量',
        type: 'bar',
        barMaxWidth: 44,
        data: rooms.map((room) => room.usage),
        itemStyle: {
          color: '#1f5fa8',
          borderRadius: [5, 5, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          color: '#1f2d3d',
          formatter: (params) => params.value
        }
      }
    ]
  }, true);
};

// 加载数据
const loadData = async () => {
  showStatus('loading', '正在加载 ' + DATA_URL + '…');
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();

    // 空数据状态
    if (!Array.isArray(data.rooms) || data.rooms.length === 0) {
      disposeChart();
      showStatus('empty', '暂无数据：data.json 中没有可展示的自习室使用量记录。');
      return;
    }

    hideStatus();
    metaEl.textContent =
      '统计周期：' + data.period
      + '｜指标单位：' + data.unit
      + '｜数据来源：' + data.source;
    renderChart(data);
  } catch (error) {
    // 加载失败（断网、404、JSON 解析错误都会进入这里）
    disposeChart();
    showStatus(
      'error',
      '数据加载失败：<strong>' + error.message + '</strong>。<br>'
      + '请检查本地服务是否正常（需通过 http:// 而非 file:// 访问）。'
    );
  }
};

// 窗口拉伸：ECharts 需手动 resize
window.addEventListener('resize', () => {
  if (usageChart !== null) {
    usageChart.resize();
  }
});

loadData();
