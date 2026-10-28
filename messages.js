const conversations = {
    ali: {
        name: "Ali Ahmed",
        initials: "AA",
        avatarClass: "",
        lastMessage: "How is the project going?",
        messages: [
            {
                text: "Hello! How is the project going?",
                type: "received",
                time: "2:30 PM"
            },
            {
                text: "Hello! The project is almost complete.",
                type: "sent",
                time: "2:32 PM"
            }
        ]
    },

    sara: {
        name: "Sara Khan",
        initials: "SK",
        avatarClass: "pink",
        lastMessage: "Thank you for the update!",
        messages: [
            {
                text: "Can you share the latest update?",
                type: "received",
                time: "Yesterday"
            },
            {
                text: "The design is ready for review.",
                type: "sent",
                time: "Yesterday"
            },
            {
                text: "Thank you for the update!",
                type: "received",
                time: "Yesterday"
            }
        ]
    },

    ahmed: {
        name: "Ahmed Malik",
        initials: "AM",
        avatarClass: "purple",
        lastMessage: "Please check the design.",
        messages: [
            {
                text: "I have shared the project design.",
                type: "received",
                time: "Monday"
            },
            {
                text: "Please check the design.",
                type: "received",
                time: "Monday"
            }
        ]
    }
};

let activeUser = "ali";
let selectedRating = 0;

const chatWindow = document.getElementById("chatWindow");
const chatUser = document.getElementById("chatUser");
const chatAvatar = document.getElementById("chatAvatar");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const pageMessage = document.getElementById("pageMessage");


// Display messages in the selected conversation
function displayMessages() {
    const conversation = conversations[activeUser];

    chatWindow.replaceChildren();

    chatUser.textContent = conversation.name;
    chatAvatar.textContent = conversation.initials;
    chatAvatar.className = "avatar";

    if (conversation.avatarClass) {
        chatAvatar.classList.add(conversation.avatarClass);
    }

    conversation.messages.forEach(function (message) {
        const messageBox = document.createElement("div");
        messageBox.className = "message " + message.type;

        const messageText = document.createElement("span");
        messageText.textContent = message.text;

        const messageTime = document.createElement("small");
        messageTime.className = "message-time";
        messageTime.textContent = message.time;

        messageBox.append(messageText, messageTime);
        chatWindow.appendChild(messageBox);
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;
}


// Switch between conversations
document.querySelectorAll(".conversation").forEach(function (button) {
    button.addEventListener("click", function () {
        activeUser = button.dataset.user;

        document.querySelectorAll(".conversation").forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        // Remove the unread indicator for the selected conversation
        const unreadDot = button.querySelector(".unread-dot");

        if (unreadDot) {
            unreadDot.remove();
        }

        displayMessages();
    });
});


// Send a message
messageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = messageInput.value.trim();

    if (text === "") {
        pageMessage.textContent = "Please enter a message first.";
        return;
    }

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    conversations[activeUser].messages.push({
        text: text,
        type: "sent",
        time: time
    });

    conversations[activeUser].lastMessage = text;

    const activeButton = document.querySelector(
        '.conversation[data-user="' + activeUser + '"]'
    );

    if (activeButton) {
        const preview = activeButton.querySelectorAll("small");

        if (preview[0]) {
            preview[0].textContent = text;
        }

        if (preview[1]) {
            preview[1].textContent = time;
        }
    }

    displayMessages();

    messageInput.value = "";
    pageMessage.textContent = "Message added to the chat.";
});


// Open the notifications section
const notificationBtn = document.getElementById("notificationBtn");
const notificationsSection = document.getElementById(
    "notificationsSection"
);

notificationBtn.addEventListener("click", function () {
    notificationsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// Count unread notifications
function updateUnreadCount() {
    const unreadItems = document.querySelectorAll(
        ".notification-item.unread"
    );

    const unreadCount = document.getElementById("unreadCount");

    unreadCount.textContent = unreadItems.length;
    unreadCount.style.display = unreadItems.length === 0
        ? "none"
        : "inline-block";
}


// Mark a notification as read when clicked
document.querySelectorAll(".notification-item").forEach(function (item) {
    item.addEventListener("click", function () {
        item.classList.remove("unread");
        updateUnreadCount();
    });
});


// Mark all notifications as read
document.getElementById("markAllRead").addEventListener(
    "click",
    function () {
        document.querySelectorAll(".notification-item").forEach(
            function (item) {
                item.classList.remove("unread");
            }
        );

        updateUnreadCount();
        pageMessage.textContent = "All notifications marked as read.";
    }
);


// Select a star rating
const starButtons = document.querySelectorAll(
    "#starRating button"
);

const ratingText = document.getElementById("ratingText");

starButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectedRating = Number(button.dataset.rating);

        starButtons.forEach(function (star) {
            const rating = Number(star.dataset.rating);
            const isSelected = rating <= selectedRating;

            star.classList.toggle("selected", isSelected);
            star.setAttribute(
                "aria-pressed",
                String(rating === selectedRating)
            );
        });

        ratingText.textContent =
            "You selected " + selectedRating +
            " out of 5 stars.";
    });
});


// Submit a review
const reviewForm = document.getElementById("reviewForm");
const reviewMessage = document.getElementById("reviewMessage");
const reviewsList = document.getElementById("reviewsList");

reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const reviewerName = document.getElementById(
        "reviewerName"
    ).value.trim();

    const reviewTarget = document.getElementById(
        "reviewTarget"
    ).value;

    const reviewComment = document.getElementById(
        "reviewComment"
    ).value.trim();

    reviewMessage.className = "feedback";

    if (reviewerName === "" || reviewComment === "") {
        reviewMessage.textContent =
            "Please fill in all required fields.";

        reviewMessage.classList.add("error");
        return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
        reviewMessage.textContent =
            "Please select a star rating first.";

        reviewMessage.classList.add("error");
        return;
    }

    // Create a new review card safely
    const reviewCard = document.createElement("article");
    reviewCard.className = "review-card";

    const reviewTop = document.createElement("div");
    reviewTop.className = "review-top";

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = reviewerName
        .split(/\s+/)
        .map(function (part) {
            return part.charAt(0);
        })
        .join("")
        .substring(0, 2)
        .toUpperCase();

    const reviewerInfo = document.createElement("div");

    const name = document.createElement("h3");
    name.textContent = reviewerName + " · " + reviewTarget;

    const date = document.createElement("p");
    date.className = "review-date";
    date.textContent = new Date().toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

    reviewerInfo.append(name, date);

    const stars = document.createElement("span");
    stars.className = "review-stars";
    stars.textContent =
        "★".repeat(selectedRating) +
        "☆".repeat(5 - selectedRating);

    stars.setAttribute(
        "aria-label",
        selectedRating + " out of 5 stars"
    );

    reviewTop.append(avatar, reviewerInfo, stars);

    const comment = document.createElement("p");
    comment.textContent = reviewComment;

    reviewCard.append(reviewTop, comment);

    // Show the latest review first
    reviewsList.prepend(reviewCard);

    reviewMessage.textContent = "Your review was submitted successfully!";
    reviewMessage.classList.add("success");

    reviewForm.reset();

    selectedRating = 0;

    starButtons.forEach(function (star) {
        star.classList.remove("selected");
        star.setAttribute("aria-pressed", "false");
    });

    ratingText.textContent = "Select your rating (1–5).";
});


// Initial page setup
displayMessages();
updateUnreadCount();