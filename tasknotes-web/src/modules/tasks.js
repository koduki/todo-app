import TaskHelper from "@/modules/task_helper";
import TaskNotesAPI from "@/modules/tasknotes_api";
import store from "@/store";
import Template from "@/modules/template";

export default class {
  constructor() {
    this.timer = null;
    this.callbackForSave = null;
    this.content = "";
    this.prevContent = "";
    console.log(this);

    if (this.data.length === 0) {
      this.text = Template.defaultEditorContents();
    } else {
      this.content = TaskHelper.toContent(this.data);
    }

    //
    // Method Define
    //
    this.startAutoSave = (callbackForSave) => {
      this.callbackForSave = callbackForSave;
      this.timer = setInterval(this.save, 5 * 1000);
    };

    this.stopAutoSave = () => {
      clearInterval(this.timer);
    };

    this.load = (callback) => {
      TaskNotesAPI.callLoad((response) => {
        this.text = response.data.text;
        callback(response);
      });
    };

    this.save = () => {
      if (this.prevContent != this.content) {
        this.prevContent = this.content;
        TaskNotesAPI.callSave((response) => {
          this.callbackForSave(response.data);
        }, this.content);
      } else {
        console.log("skip save");
      }
    };
  }

  get data() {
    return store.state.task.tasks;
  }
  set data(value) {
    store.dispatch("task/updateTasks", value);
  }

  get text() {
    return this.content;
  }
  set text(value) {
    this.content = value;
    this.data = TaskHelper.parse(value);
  }
}
