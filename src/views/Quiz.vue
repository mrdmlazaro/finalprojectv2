<template>

    <body>
        <div id="quiz-container">
            <section class="quiz" v-if="!quizCompleted">
                <v-card class="vcard" max-width="1024px" color="#333333">
                    <img alt="Sports" src="/sports.png" />
                    <h5>Score: {{score}}/{{questions.length}}</h5>
                    <h3>Question: {{questionCurrentNumber}} / {{questions.length}}</h3>
                    <!-- div#correctAnswers -->
                    <div>
                        <h1 v-html="loading ? 'Loading...' : currentQuestion.question"></h1>
                        <form v-if="currentQuestion">
                            <button class="button" v-for="answer in currentQuestion.answers"
                                :index="currentQuestion.key" :key="answer" v-html="answer"
                                @click.prevent="handleButtonClick"></button>
                        </form>
                    </div>
                </v-card>
            </section>
            <section v-else>
                <v-card class="vcard1" max-height="1024px" color="#5485b4">
                    <h1 id="quizresult">Quiz Result:</h1>
                    <v-card-text v-if="!pass">
                        <h1 id="quizfailed">{{result}}</h1>
                        <p id="quizfailed">{{score}}/{{questions.length}}</p>
                        <button class="button" @click="reloadPage()">TRY AGAIN</button>
                    </v-card-text>
                    <v-card-text v-else>
                        <h1 id="quizpassed">{{result}}</h1>
                        <p id="quizpassed">{{score}}/{{questions.length}}</p>
                        <button class="button" @click="reloadPage()">TRY AGAIN</button>
                    </v-card-text>
                </v-card>
            </section>
        </div>
    </body>
</template>
    
<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import db from '@/fb'
export default {
    name: "Quiz",
    // data() function stores state variables
    data() {
        return {
            questions: [],
            loading: true,
            index: 0,
            score: 0,
            questionCurrentNumber: 1,
            quizCompleted: false,
            result: "",
            passingScore: "",
            pass: false,
            squiz: false,
        };
    },
    computed: {
        currentQuestion() {
            if (this.questions !== []) {
                return this.questions[this.index];
            }
            return null;
        },
    },

    // Custom methods of the Vue Component
    methods: {
        reloadPage() {
            window.location.reload();
        },

        async fetchQuestions() {
            this.loading = true;
            let response = await fetch(
                "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple"
            );
            let jsonResponse = await response.json();
            let index = 0; // index is used to identify single answer
            let data = jsonResponse.results.map((question) => {
                // put answers on question into single array
                question.answers = [
                    question.correct_answer,
                    ...question.incorrect_answers,
                ];
                // Shuffle question.answers array
                for (let i = question.answers.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [question.answers[i], question.answers[j]] = [
                        question.answers[j],
                        question.answers[i],
                    ];
                }
                // add rightAnswer and key property to each question
                question.rightAnswer = null;
                question.key = index;
                index++;
                return question;
            });
            this.questions = data;
            this.loading = false;
        },

        handleButtonClick: function (event) {
            /* Find index to identiy question object in data */
            let index = event.target.getAttribute("index");

            let pollutedUserAnswer = event.target.innerHTML; // innerHTML is polluted with decoded HTML entities e.g ' from &#039;
            /* Clear from pollution with ' */
            let userAnswer = pollutedUserAnswer.replace(/'/, "&#039;");

            /* Set userAnswer on question object in data */
            this.questions[index].userAnswer = userAnswer;

            /* Set class "clicked" on button with userAnswer -> for CSS Styles; Disable other sibling buttons */
            event.target.classList.add("clicked");
            let allButtons = document.querySelectorAll(`[index="${index}"]`);

            for (let i = 0; i < allButtons.length; i++) {
                if (allButtons[i] === event.target) continue;

                allButtons[i].setAttribute("disabled", "");
            }

            /* Invoke checkAnswer to check Answer */
            this.checkAnswer(event, index);
        },
        checkAnswer: function (event, index) {
            let question = this.questions[index];

            if (question.userAnswer) {
                if (this.index < this.questions.length - 1) {
                    setTimeout(
                        function () {
                            this.index += 1;
                        }.bind(this),
                        500
                    );
                }
                if (question.userAnswer === question.correct_answer) {
                    /* Set class on Button if user answered right, to celebrate right answer with animation joyfulButton */
                    event.target.classList.add("rightAnswer");
                    /* Set rightAnswer on question to true, computed property can track a streak out of 10 questions */
                    this.questions[index].rightAnswer = true;
                    this.score++;
                } else {
                    /* Mark users answer as wrong answer */
                    event.target.classList.add("wrongAnswer");
                    this.questions[index].rightAnswer = false;
                    /* Show right Answer */
                    let correctAnswer = this.questions[index].correct_answer;
                    let allButtons = document.querySelectorAll(`[index="${index}"]`);
                    allButtons.forEach(function (button) {
                        if (button.innerHTML === correctAnswer) {
                            button.classList.add("showRightAnswer");
                        }
                    });
                }

                if (this.questionCurrentNumber < this.questions.length) {
                    this.questionCurrentNumber++;
                }
                else {
                    const auth = getAuth();
                    this.quizCompleted = true
                    if (this.quizCompleted = true) {
                        this.passingScore = (0.5 * this.questions.length);
                        if (this.score >= this.passingScore) {
                            this.result = "YOU PASSED, I'M PROUD OF YOU"
                            this.pass = true
                        }
                        else {
                            this.result = "YOU FAILED, STUDY HARDER!"
                        }
                    }
                    const quiz = {
                        user: auth.currentUser.email,
                        scores: this.score,
                        remarks: this.result,
                        timestamp: new Date(),
                    }
                    db.collection('quizzes').add(quiz).then(() => {
                        console.log("Quiz has been recorded")
                    })

                }

            }

        },
    },

    // Code inside mounted() runs after the Component has mounted
    mounted() {
        this.fetchQuestions();
    },
};
</script>
    
<style scoped>
body {
    background-image: url("/bg1.png");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    min-height: 100vh;
    padding: 50px;
}

#quiz-container {
    margin: auto;
    font-family: "Gotham Medium", Helvetica, Arial;
    max-width: 750px;
    text-align: center;
}

@media only screen and (max-width: 500px) {}

p {
    color: white;
    font-family: "Gotham Medium", Helvetica, Arial;
    font-size: 1.3rem;
    padding: 0.7rem;
}

h1 {
    color: white;
    font-family: "Gotham Black", Helvetica, Arial;
    font-size: 1.3rem;
    padding: 0.7rem;
}

#quizresult h1 {
    color: white;
    font-size: 0.7rem;
    padding: 0.7rem;
}

#quizfailed {
    color: rgb(255, 0, 0);
    font-family: "Gotham Black", Helvetica, Arial;
    font-size: 2.5rem;
    padding: 1rem;
}

#quizpassed {
    color: rgb(0, 255, 34);
    font-family: "Gotham Black", Helvetica, Arial;
    font-size: 2.5rem;
    padding: 1rem;
}

h5 {
    color: white;
    font-family: "Gotham Medium", Helvetica, Arial;
    font-size: 1.3rem;
    padding: 0.7rem;
}

h3 {
    color: white;
    font-family: "Gotham Medium", Helvetica, Arial;
    font-size: 1.3rem;
    padding: 0.7rem;
}

.divider {
    font-family: "Gotham Bold", Helvetica, Arial;
    margin: 0.5rem 0;
    border: 3px solid rgba(102, 255, 166, 0.7);
    border-radius: 2px;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.3);
}

form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}

button {
    font-family: "Gotham Bold", Helvetica, Arial;
    font-size: 1.1rem;
    box-sizing: border-box;
    padding: 1rem;
    margin: 0.3rem;
    width: 47%;
    background-color: rgba(61, 29, 238, 0.3);
    border: none;
    border-radius: 0.4rem;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.2);
}

button:hover:enabled {
    transform: scale(1.02);
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
        0 3px 1px -1px rgba(0, 0, 0, 0.2);
}

button:focus {
    outline: none;
}

.vcard {
    font-family: "Gotham Medium", Helvetica, Arial;
    padding: 25px 25px 25px 25px;
    border-radius: 100px;
}
.vcard1 {
    font-family: "Gotham Black", Helvetica, Arial;
    border-radius: 200px;
    margin: auto;
}

.title {
    font-family: "Gotham Bold", Helvetica, Arial;
    font-size: 30px;
    color: white;
}

.button {
    color: white;
}

button:active:enabled {
    transform: scale(1.05);
}

@keyframes flashButton {
    0% {
        opacity: 1;
        transform: scale(1.01);
    }

    50% {
        opacity: 0.7;
        transform: scale(1.02);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

button.clicked {
    pointer-events: none;
}

button.rightAnswer {
    animation: flashButton;
    animation-duration: 400ms;
    animation-delay: 100ms;
    animation-iteration-count: 3;
    animation-timing-function: ease-in-out;
    color: black;
    background: linear-gradient(210deg,
            rgba(0, 178, 72, 0.25),
            rgba(0, 178, 72, 0.5));
}

button.wrongAnswer {
    color: black;
    background: linear-gradient(210deg,
            rgba(245, 0, 87, 0.25),
            rgba(245, 0, 87, 0.5));
}

button.showRightAnswer {
    animation: flashButton;
    animation-duration: 500ms;
    animation-delay: 100ms;
    animation-iteration-count: 2;
    animation-timing-function: ease-in-out;
    color: black;
    background: linear-gradient(210deg,
            rgba(0, 178, 72, 0.25),
            rgba(0, 178, 72, 0.5));
}
</style>