document.addEventListener('DOMContentLoaded', function() {
  const memberListDiv = document.getElementById('member-list');
  const searchInput = document.getElementById('search-input');
  const totalMembersSpan = document.getElementById('total-members');
  const masterCountSpan = document.getElementById('master-count');
  const advancedCountSpan = document.getElementById('advanced-count');
  const goodCountSpan = document.getElementById('good-count');
  const badgeHoldersSpan = document.getElementById('badge-holders');
  const badgeDetailsDiv = document.getElementById('badge-details-popup');
  const summaryBtn = document.getElementById('summary-btn');
  const badgeDetailsBtn = document.getElementById('badge-details-btn');
  const summaryPopup = document.getElementById('summary-popup');
  const badgeDetailsPopup = document.getElementById('badge-details-popup');
  const closeButtonSummary = summaryPopup.querySelector('.close-button');
  const closeButtonBadgeDetails = badgeDetailsPopup.querySelector('.close-button');

  let membersData = [];
  let badges = {};

  // badges.txt の読み込み
  fetch('badges.txt')
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n');
      lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length === 2) {
          badges[parts[0].trim()] = parts[1].trim();
        }
      });
    })
    .then(() => {
      // members.txt の読み込み
      return fetch('members.txt');
    })
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n');
      membersData = lines.map(line => {
        const parts = line.split(',');
        return {
          name: parts[0].trim(),
          rank: parts[1].trim(),
          badges: parts.slice(2).map(badge => badge.trim())
        };
      });

      // 名簿の表示
      displayMembers(membersData);
      updateSummary(membersData);
    })
    .catch(error => console.error('Error:', error));

  // 名簿の表示
  function displayMembers(members) {
    memberListDiv.innerHTML = '';
    members.forEach(member => {
      const memberDiv = document.createElement('div');
      memberDiv.classList.add('member');
      let memberHTML = `<b>${member.name}</b> - `;

      if (member.rank === '[M]') {
        memberHTML += 'Master ';
      } else if (member.rank === '[A]') {
        memberHTML += 'Advanced ';
      } else if (member.rank === '[G]') {
        memberHTML += 'Good ';
      }

      member.badges.forEach(badgeId => {
        if (badges[badgeId.replace('[', '').replace(']', '')]) {
          const badgeUrl = badges[badgeId.replace('[', '').replace(']', '')];
          memberHTML += `<img src="${badgeUrl}" alt="${badgeId}" class="badge">`;
        }
      });

      memberDiv.innerHTML = memberHTML;
      memberListDiv.appendChild(memberDiv);
    });
  }

  // 集計の更新
  function updateSummary(members) {
    totalMembersSpan.textContent = members.length;
    masterCountSpan.textContent = members.filter(member => member.rank === '[M]').length;
    advancedCountSpan.textContent = members.filter(member => member.rank === '[A]').length;
    goodCountSpan.textContent = members.filter(member => member.rank === '[G]').length;
    badgeHoldersSpan.textContent = members.filter(member => member.badges.length > 0).length;
  }

  // 検索機能
  searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMembers = membersData.filter(member => member.name.toLowerCase().includes(searchTerm));
    displayMembers(filteredMembers);
    updateSummary(filteredMembers);
  });

  // ポップアップの表示
  summaryBtn.addEventListener('click', function() {
    summaryPopup.style.display = 'block';
  });

  badgeDetailsBtn.addEventListener('click', function() {
    badgeDetailsPopup.style.display = 'block';
  });

  closeButtonSummary.addEventListener('click', function() {
    summaryPopup.style.display = 'none';
  });

  closeButtonBadgeDetails.addEventListener('click', function() {
    badgeDetailsPopup.style.display = 'none';
  });

  // 背景クリックでポップアップを閉じる
  document.addEventListener('click', function(event) {
    if (event.target === summaryPopup) {
      summaryPopup.style.display = 'none';
    } else if (event.target === badgeDetailsPopup) {
      badgeDetailsPopup.style.display = 'none';
    }
  });
});
