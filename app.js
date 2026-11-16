const screens = {
  home: document.getElementById("homeScreen"),
  topics: document.getElementById("topicsScreen"),
  study: document.getElementById("studyScreen")
};

let currentSubject = window.studyData.subjects[0];
let currentTopic = currentSubject.topics[0];
let currentCards = [];
let cardIndex = 0;
let isAnswerVisible = false;

function showScreen(name) {
  Object.keys(screens).forEach(key => screens[key].classList.toggle("hidden", key !== name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderSubjects() {
  const grid = document.getElementById("subjectGrid");
  grid.innerHTML = "";
  window.studyData.subjects.forEach(subject => {
    const count = window.studyData.cards.filter(card => subject.topics.some(topic => topic.id === card[0])).length;
    const button = document.createElement("button");
    button.className = "subject-card";
    button.innerHTML = '<span class="subject-icon">' + subject.icon + '</span><strong>' + subject.title + '</strong><small>' + count + ' карточек · ' + subject.description + '</small>';
    button.addEventListener("click", () => openSubject(subject));
    grid.appendChild(button);
  });
}

function openSubject(subject) {
  currentSubject = subject;
  document.getElementById("subjectTitle").textContent = subject.title;
  document.getElementById("subjectDescription").textContent = subject.description;
  renderTopics();
  showScreen("topics");
}

function renderTopics() {
  const grid = document.getElementById("topicGrid");
  grid.innerHTML = "";
  currentSubject.topics.forEach((topic, index) => {
    const count = window.studyData.cards.filter(card => card[0] === topic.id).length;
    const button = document.createElement("button");
    button.className = "topic-card";
    button.innerHTML = '<span class="topic-number">РАЗДЕЛ 0' + (index + 1) + '</span><strong>' + topic.icon + ' ' + topic.title + '</strong><small>' + count + ' карточек · ' + topic.description + '</small>';
    button.addEventListener("click", () => openTopic(topic));
    grid.appendChild(button);
  });
}

function openTopic(topic) {
  currentTopic = topic;
  currentCards = window.studyData.cards.filter(card => card[0] === topic.id);
  cardIndex = 0;
  document.getElementById("studySubject").textContent = currentSubject.title.toUpperCase();
  document.getElementById("studyTitle").textContent = topic.title;
  showCard();
  showScreen("study");
}

function showCard() {
  const card = currentCards[cardIndex];
  isAnswerVisible = false;
  document.getElementById("cardSide").textContent = "ВОПРОС";
  document.getElementById("cardText").textContent = card[1];
  document.getElementById("cardHint").textContent = "Подумай и проверь себя";
  document.getElementById("cardCounter").textContent = (cardIndex + 1) + " / " + currentCards.length;
  document.getElementById("progressBar").style.width = ((cardIndex + 1) / currentCards.length * 100) + "%";
  document.getElementById("prevCard").disabled = cardIndex === 0;
  document.getElementById("nextCard").textContent = cardIndex === currentCards.length - 1 ? "В начало ↺" : "Следующий →";
}

function flipCard() {
  const card = currentCards[cardIndex];
  isAnswerVisible = !isAnswerVisible;
  document.getElementById("cardSide").textContent = isAnswerVisible ? "ОТВЕТ" : "ВОПРОС";
  document.getElementById("cardText").textContent = isAnswerVisible ? card[2] : card[1];
  document.getElementById("cardHint").textContent = isAnswerVisible ? "Нажми, чтобы увидеть вопрос" : "Подумай и проверь себя";
}

function nextCard() {
  cardIndex = cardIndex === currentCards.length - 1 ? 0 : cardIndex + 1;
  showCard();
}
function previousCard() {
  if (cardIndex > 0) {
    cardIndex--;
    showCard();
  }
}
function shuffleCards() {
  for (let i = currentCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
  }
  cardIndex = 0;
  showCard();
}

document.getElementById("homeLink").addEventListener("click", event => { event.preventDefault(); showScreen("home"); });
document.getElementById("backToSubjects").addEventListener("click", () => showScreen("home"));
document.getElementById("backToTopics").addEventListener("click", () => showScreen("topics"));
document.getElementById("flashcard").addEventListener("click", flipCard);
document.getElementById("prevCard").addEventListener("click", previousCard);
document.getElementById("nextCard").addEventListener("click", nextCard);
document.getElementById("shuffleCards").addEventListener("click", shuffleCards);

renderSubjects();