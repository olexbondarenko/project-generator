<template>
  <div class="project-generator">
    <GenerationForm class="project-generator__form" />
  </div>
</template>

<script>
import GenerationForm from "./components/GenerationForm.vue";

export default {
  name: "ProjectGenerator",
  components: {
    GenerationForm,
  },
};
</script>

<style lang="scss">
@import "@/styles/component.scss";
</style>
