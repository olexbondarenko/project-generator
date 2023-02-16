<template>
  <form ref="form" class="form">
    <input
      type="text"
      v-model="globalName"
      placeholder="Project name"
      autocomplete="off"
      class="form__field form-field"
    />

    <fieldset class="form__fieldset form-fieldset">
      <legend class="form-fieldset__title">Project Options</legend>

      <div class="form-fieldset__group form-fieldset-group">
        <div class="form-fieldset-group__item form-fieldset-group-item">
          <input
            id="use-banner"
            type="checkbox"
            :checked="isUseBanner"
            class="form-fieldset-group-item__checkbox form-checkbox"
          />
          <label for="use-banner" class="form-fieldset-group-item__label">
            Use Banner
          </label>
        </div>
      </div>
    </fieldset>

    <fieldset class="form__fieldset form-fieldset">
      <legend class="form-fieldset__title">Project Components</legend>

      <div
        v-if="components.length > 0"
        class="form-fieldset__fields form-fieldset-fields"
      >
        <div
          v-for="(group, groupIdx) in components"
          :key="`form-fieldset-fields__group-${groupIdx}`"
          class="form-fieldset-fields__group"
        >
          <div
            :id="`form-field-${groupIdx}`"
            class="form-fieldset-fields__item"
          >
            <input
              v-model="group.field.value"
              type="text"
              placeholder="Component Name"
              autocomplete="off"
              class="form-field"
            />
          </div>
          <div
            class="form-fieldset-fields__options form-fieldset-fields-options"
          >
            <div
              v-for="(option, optionsIdx) in group.options"
              :key="`form-fieldset-fields__item-${optionsIdx}`"
              class="form-fieldset-fields-options__item"
            >
              <input
                @click="updateCheckboxes(group.options, optionsIdx)"
                type="checkbox"
                v-model="option.checked"
                :value="option.value"
                :id="`form-checkbox-${groupIdx}-${optionsIdx}`"
                class="form-checkbox"
              />
              <label :for="`form-checkbox-${groupIdx}-${optionsIdx}`">
                {{ option.label }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <button @click="addComponentField" class="form-button" type="button">
        Add Component
      </button>
    </fieldset>

    <button @click.prevent="generateProject" class="form-button">
      Generate Project
    </button>
  </form>
</template>

<script>
import { inject, ref, unref } from "vue";

export default {
  name: "GenerationForm",
  setup() {
    const axios = inject("axios");
    const globalName = ref("");
    const isUseBanner = ref(false);
    const components = ref([]);
    const componentOptions = [
      {
        template: "default",
        label: "Default Template",
        checked: true,
      },
      {
        template: "button",
        label: "Button Template",
        checked: false,
      },
      {
        template: "mainModal",
        label: "Main Modal Template",
        checked: false,
      },
      {
        template: "defaultModal",
        label: "Default Modal Template",
        checked: false,
      },
    ];

    const addComponentField = () => {
      components.value.push({
        field: { value: "" },
        options: JSON.parse(JSON.stringify([...componentOptions])),
      });
    };

    const updateCheckboxes = (options, index) => {
      unref(options).forEach((option) => {
        option.checked = false;
      });

      unref(options)[index].checked = true;
    };

    const generateProject = async () => {
      const data = {
        globalName: unref(globalName),
        useBanner: unref(isUseBanner),
        components: unref(components),
      };

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (data.globalName) {
        await axios
          .post("http://localhost:3000", JSON.stringify(data), { headers })
          .then((response) => {
            alert(response.data.message);
          })
          .catch((err) => {
            alert(err.data.message);
          });
      } else {
        alert("Enter project name!");
      }
    };

    return {
      globalName,
      isUseBanner,
      components,
      componentOptions,
      updateCheckboxes,
      addComponentField,
      generateProject,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/components/styles/generationForm/component.scss";
</style>
