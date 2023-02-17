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
            v-model="isUseBanner"
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
            class="form-fieldset-fields__item form-fieldset-fields-item"
          >
            <input
              v-model="group.field.value"
              type="text"
              placeholder="Component name"
              autocomplete="off"
              class="form-field"
            />
            <div
              @click="removeComponentField(groupIdx)"
              class="form-fieldset-fields-item__remove"
              title="Remove Field"
            >
              &times;
            </div>
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

      <button
        @click="addComponentField"
        class="form-button form-button--size-small form-button--theme-green"
        type="button"
      >
        +
      </button>
    </fieldset>

    <button
      @click.prevent="generateProject"
      :disabled="isDisabledGenerationButton"
      class="form-button form-button--size-medium form-button--theme-black"
    >
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
    const isDisabledGenerationButton = ref(false);
    const globalName = ref("");
    const isUseBanner = ref(false);
    const components = ref([]);
    const componentOptions = [
      {
        template: "default",
        label: "Default",
        checked: true,
      },
      {
        template: "button",
        label: "Button",
        checked: false,
      },
      {
        template: "ticketsList",
        label: "Tickets List",
        checked: false,
      },
      {
        template: "mainModal",
        label: "Main Modal",
        checked: false,
      },
      {
        template: "defaultModal",
        label: "Default Modal",
        checked: false,
      },
    ];

    const addComponentField = () => {
      components.value.push({
        field: { value: "" },
        options: JSON.parse(JSON.stringify([...componentOptions])),
      });
    };

    const removeComponentField = (index) => {
      unref(components).splice(index, 1);
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

      isDisabledGenerationButton.value = true;

      if (data.globalName) {
        await axios
          .post("http://localhost:3000", JSON.stringify(data), { headers })
          .then((response) => {
            alert(response.data.message);
            isDisabledGenerationButton.value = false;
          })
          .catch((err) => {
            alert(err.message);
            isDisabledGenerationButton.value = false;
          });
      } else {
        alert("Enter project name!");
      }
    };

    return {
      isDisabledGenerationButton,
      globalName,
      isUseBanner,
      components,
      componentOptions,
      updateCheckboxes,
      addComponentField,
      removeComponentField,
      generateProject,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/components/styles/generationForm/component.scss";
</style>
