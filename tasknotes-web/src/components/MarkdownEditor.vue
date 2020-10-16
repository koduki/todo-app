<template>
  <div class="MarkdownEditor">
    <loading
      :active.sync="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="fullPage"
    ></loading>
    <div class="updated_timestamp"></div>
    <vue-simplemde v-model="content" ref="markdownEditor" />
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import VueSimplemde from "vue-simplemde";
import TaskNoteAPI from "@/modules/tasknotes_api";
import Tasks from "@/modules/tasks";

export default {
  name: "markdown-editor",
  props: {
    value: {
      type: String,
    },
  },
  components: {
    VueSimplemde,
    loading: Loading,
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      tasks: new Tasks(),
    };
  },
  computed: {
    content: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  mounted() {
    document
      .getElementsByClassName("vue-simplemde")[0]
      .addEventListener("paste", this.onPasteImage);
  },
  methods: {
    insertText(term) {
      const editor = this.$refs.markdownEditor.simplemde;

      const cm = editor.codemirror;
      var startPoint = cm.getCursor("start");
      var endPoint = cm.getCursor("end");

      cm.replaceSelection(term);
      cm.setSelection(startPoint, endPoint);
      cm.focus();
    },
    onPasteImage(event) {
      console.log(event);

      const items = event.clipboardData.items;
      for (var i = 0; i < items.length; i++) {
        const item = items[i];
        const file = item.getAsFile();
        if (item.type.indexOf("image") != -1) {
          event.preventDefault();
          this.isLoading = true;
          TaskNoteAPI.callUploadImage(
            file,
            (response) => {
              this.insertText("![image.png](" + response.data.url + ")");
              this.isLoading = false;
            },
            (error) => {
              this.isLoading = false;
            }
          );
        }
      }
    },
    onCancel: function () {
      console.log("User cancelled the loader.");
    },
  },
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
</style>

<style>
#markdownEditor .CodeMirror {
  height: 800px;
}