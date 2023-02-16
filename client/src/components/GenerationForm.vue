<template>
  <form ref="form" class="form">
    <input
      type="text"
      name="global-name"
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
            name="use-banner"
            checked="false"
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

      <div class="form-fieldset__fields form-fieldset-fields">
        <div
          v-for="(group, groupIdx) in componentFields"
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
              name="components[]"
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
                name="templates[]"
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
    const form = ref();
    const componentFields = ref([]);
    const componentFieldOptions = [
      {
        value: "default",
        name: "templates[]",
        label: "Default Template",
        checked: true,
      },
      {
        value: "button",
        name: "",
        label: "Button Template",
        checked: false,
      },
      {
        value: "mainModal",
        name: "templates[]",
        label: "Main Modal Template",
        checked: false,
      },
      {
        value: "defaultModal",
        name: "templates[]",
        label: "Default Modal Template",
        checked: false,
      },
    ];

    const addComponentField = () => {
      componentFields.value.push({
        field: {
          name: "components[]",
          value: "",
        },
        options: JSON.parse(JSON.stringify([...componentFieldOptions])),
      });
    };

    const updateCheckboxes = (options, index) => {
      unref(options).forEach((option) => {
        option.checked = false;
      });

      unref(options)[index].checked = true;
    };

    const generateProject = async () => {
      const formData = new FormData(unref(form));
      const data = {
        globalName: formData.get("global-name"),
        useBanner: formData.get("use-banner"),
        components: formData.getAll("components[]"),
        templates: formData.getAll("templates[]"),
      };
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      console.log(data);

      if (data.globalName) {
        await axios
          .post("http://localhost:3000", JSON.stringify(data), { headers })
          .then((response) => {
            console.log(response);
            // alert(response.message);
          })
          .catch((err) => {
            console.log(err);
            // alert(err.message);
          });
      } else {
        alert("Enter project name!");
      }
    };

    return {
      form,
      componentFields,
      updateCheckboxes,
      componentFieldOptions,
      addComponentField,
      generateProject,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/components/styles/generationForm/component.scss";
</style>
