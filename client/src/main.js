import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import ProjectGenerator from "./ProjectGenerator.vue";

const app = createApp(ProjectGenerator);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

app.mount("#app");
