/* ============================================================
   自习室查询：数据写死在 JS 数组
   复用课堂五的筛选模式：读取下拉条件 → filter 过滤数组 → 重新渲染
   楼层 / 开放状态两个条件为「与」关系，选择后即时生效
   ============================================================ */

// 房间名称与统计页 data.json 保持一致，便于两个模块口径统一
const ROOMS = [
  { name: '文科楼101', building: '文科楼', floor: 1, seats: 80,  open: true,  hours: '08:00-22:00', zone: '安静区' },
  { name: '文科楼203', building: '文科楼', floor: 2, seats: 60,  open: false, hours: '暂停开放',   zone: '普通区' },
  { name: '文科楼305', building: '文科楼', floor: 3, seats: 100, open: true,  hours: '08:00-22:00', zone: '普通区' },
  { name: '理科楼102', building: '理科楼', floor: 1, seats: 120, open: true,  hours: '07:30-22:30', zone: '讨论区' },
  { name: '理科楼204', building: '理科楼', floor: 2, seats: 72,  open: true,  hours: '08:00-21:30', zone: '安静区' },
  { name: '理科楼301', building: '理科楼', floor: 3, seats: 90,  open: false, hours: '暂停开放',   zone: '普通区' },
  { name: '图书馆101', building: '图书馆', floor: 1, seats: 200, open: true,  hours: '08:00-23:00', zone: '安静区' },
  { name: '图书馆201', building: '图书馆', floor: 2, seats: 160, open: true,  hours: '08:00-23:00', zone: '普通区' },
  { name: '图书馆303', building: '图书馆', floor: 3, seats: 56,  open: true,  hours: '09:00-22:00', zone: '静音区' },
  { name: '图书馆401', building: '图书馆', floor: 4, seats: 48,  open: true,  hours: '09:00-21:00', zone: '讨论区' }
];

const floorSelect = document.getElementById('floorFilter');
const statusSelect = document.getElementById('statusFilter');
const resetBtn = document.getElementById('resetFilter');
const listEl = document.getElementById('roomList');
const countEl = document.getElementById('resultCount');

// 按当前两个下拉条件过滤；值为 'all' 时该维度不过滤
const getFilteredRooms = () => {
  const floor = floorSelect.value;
  const status = statusSelect.value;
  return ROOMS.filter((room) => {
    const floorMatch = floor === 'all' || String(room.floor) === floor;
    const statusMatch =
      status === 'all' ||
      (status === 'open' ? room.open : !room.open);
    return floorMatch && statusMatch;
  });
};

// 开放状态徽标
const statusBadge = (room) =>
  room.open
    ? '<span class="badge text-bg-success">开放中</span>'
    : '<span class="badge text-bg-secondary">已关闭</span>';

// 单张自习室卡片
const roomCard = (room) => `
  <div class="col-12 col-md-6 col-xl-4">
    <div class="card h-100 ${room.open ? '' : 'text-bg-light'}">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h3 class="h5 card-title mb-0">${room.name}</h3>
          ${statusBadge(room)}
        </div>
        <ul class="list-unstyled mb-3 small">
          <li class="mb-1">楼栋：${room.building} · ${room.floor} 楼</li>
          <li class="mb-1">座位数：<strong>${room.seats}</strong> 个</li>
          <li class="mb-1">开放时间：${room.hours}</li>
          <li class="mb-0">分区：<span class="tag-skeleton">${room.zone}</span></li>
        </ul>
      </div>
    </div>
  </div>
`;

// 无匹配结果时的提示卡片
const emptyResult = () => `
  <div class="col-12">
    <div class="placeholder-block">
      <h2>没有符合条件的自习室</h2>
      <p>请尝试更换楼层或开放状态，或点击「重置筛选」查看全部自习室。</p>
    </div>
  </div>
`;

// 重新渲染列表并更新计数（筛选变化后调用，即时生效）
const render = () => {
  const rooms = getFilteredRooms();
  countEl.textContent = '共找到 ' + rooms.length + ' 间自习室';
  listEl.innerHTML = rooms.length === 0
    ? emptyResult()
    : rooms.map(roomCard).join('');
};

// change 在选择确认后触发；同时监听 input 保证交互即时
floorSelect.addEventListener('change', render);
statusSelect.addEventListener('change', render);
floorSelect.addEventListener('input', render);
statusSelect.addEventListener('input', render);

// 重置筛选
resetBtn.addEventListener('click', () => {
  floorSelect.value = 'all';
  statusSelect.value = 'all';
  render();
});

// 首次渲染：默认展示全部
render();
