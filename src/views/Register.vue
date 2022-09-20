<template>

    <body>
        <div id="container">
            <v-row class="vrow">
                <v-col cols="12" sm="10" md="8" lg="6">
                    <v-card class="vcard" max-width="512px" color="#333333">
                        <img alt="LzR" class="center" src="/lzr.png" />
                        <v-card-text>
                            <v-card-title class="c-title">
                                <h2>REGISTER</h2>
                            </v-card-title>
                            <v-text-field class="text-field" v-model="email" :error-messages="errorMessages"
                                label="Enter Email" placeholder="Email" required></v-text-field>
                            <v-text-field class="text-field" v-model="password" type="password"
                                :error-messages="errorMessages" label="Enter Password" placeholder="Password" required>
                            </v-text-field>
                        </v-card-text>
                        <v-card-actions class="vcardaction">
                            <button type="text" rounded color="white" class="btn" @click="register">REGISTER</button>
                        </v-card-actions>
                        <center>
                            <p id="register">Do you already have an account? <router-link
                                    style="text-decoration: none; color: inherit;" to="/"> Click here to sign-in
                                </router-link>
                            </p>
                        </center>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </body>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router'

const email = ref("");
const password = ref("");
const router = useRouter()

const register = () => {
    const auth = getAuth()
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            console.log("Successfully Registered!");

            console.log(auth.currentUser)
            router.push('/home')
        })
        .catch((error) => {
            console.log(error.code);
            alert(error.message);
        });
};


const signInWithGoogle = () => {

};
</script>

<style scoped>
.center{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 20%;
}
body {
    background-image: url("/bg1.png");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    min-height: 100vh;
    padding-top: 150px;
    text-align: center;
}

#register {
    color: white;
}

#container {
    font-family: "Gotham Medium", Helvetica, Arial;
    padding: 1rem;
    max-width: 2000px;
}

.vrow {
    justify-content: center;
    margin-right: 50%;
    padding-left: 5%;
    height: 100%;
    width: 100%;
    font-size: 15px;
    font-weight: 600;
}

.text-field {
    color: white;
}

.c-title {
    color: white;
}

.vcard {
    font-family: "Gotham Medium", Helvetica, Arial;
    padding: 25px 25px 25px 25px;
    border-radius:50px;
}

.vcardaction {
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn {
    color: white;
    font-family: "Gotham Medium", Helvetica, Arial;
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
</style>