<template>
    <q-item>
      <q-item-section>
        <q-item-label class="item-label" overline>{{ label }}</q-item-label>
  
        <!-- Styled span to look like an input field but non-editable -->
        <div class="input-like" v-if="editingField !== field" @click="startEdit">
          {{ localData[field] || "N/A" }}
        </div>
  
        <!-- Show input if editing -->
        <q-input
          v-else
          v-model="localData[field]"
          filled
          @click.stop
        />
      </q-item-section>
  
      <!-- Edit & Save button section -->
      <q-item-section side>
        <q-btn v-if="editingField === field" label="Save" color="primary" dense @click="saveEdit" />
        <q-icon v-else name="edit" class="edit-icon" @click.stop="startEdit" />
      </q-item-section>
    </q-item>
  </template>
  
  <script>
  import { ref, watch } from "vue";
  
  export default {
    props: {
      userData: Object,
      label: String,
      field: String,
      editingField: String,
    },
    emits: ["startEdit", "saveEdit"],
    setup(props, { emit }) {
      const localData = ref({ ...props.userData });
  
      // Watch for changes in props and update local state
      watch(
        () => props.userData,
        (newVal) => {
          if (newVal) localData.value = { ...newVal };
        },
        { deep: true }
      );
  
      const startEdit = () => {
        emit("startEdit", props.field);
      };
  
      const saveEdit = () => {
        emit("saveEdit", props.field, localData.value[props.field]);
      };
  
      return {
        localData,
        startEdit,
        saveEdit,
      };
    },
  };
  </script>
  
  <style scoped>
  /* General Styles */
  .input-like {
    display: block;
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    font-size: 1.5vw;
    color: #f2f0e9;
    line-height: 40px;
    text-align: left;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
    cursor: pointer;
  }
  
  /* Label Styling */
  .item-label {
    color: #f2f0e9;
    text-align: left;
    font-size: 1.5vw;
    font-weight: 800;
    width: 100%;
    max-width: 150px;
    padding: 0;
    white-space: nowrap;
  }
  
  /* Icons & Buttons */
  .edit-icon {
    cursor: pointer;
    padding: 0 !important;
  }
  
  .q-btn {
    margin-left: 8px;
  }
  
  /* RESPONSIVE DESIGN */
  @media (max-width: 1024px) {
    .item-label {
      font-size: 2vw;
    }
    .input-like {
      font-size: 2vw;
    }
  }
  
  @media (max-width: 768px) {
    .item-label {
      font-size: 2.5vw;
      max-width: 100px;
    }
    .input-like {
      font-size: 2.5vw;
      padding: 6px;
      line-height: 35px;
    }
  }
  
  @media (max-width: 480px) {
    .item-label {
      font-size: 3vw;
      max-width: 90px;
    }
    .input-like {
      font-size: 3vw;
      padding: 5px;
      line-height: 30px;
    }
  }
  </style>
  