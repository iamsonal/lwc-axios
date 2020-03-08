/**
 * Created by sonal on 2020-03-07.
 */

import { LightningElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import Axios from "@salesforce/resourceUrl/axios";
import bootstrap from "@salesforce/resourceUrl/bootstrap";

export default class BaseComponent extends LightningElement {
   axiosInitialized = false;

   renderedCallback() {
      if (this.axiosInitialized) {
         return;
      }
      this.axiosInitialized = true;

      Promise.all([loadScript(this, Axios), loadStyle(this, bootstrap)])
         .then(() => {
            this.initializeAxios();
         })
         .catch(error => {
            console.log(error);
         });
   }

   // Optional
   initializeAxios() {
      axios.interceptors.request.use(
         config => {
            console.log(
               `${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`
            );
            return config;
         },
         error => {
            return Promise.reject(error);
         }
      );
   }

   handleClick(event) {
      axios
         .get("https://jsonplaceholder.typicode.com/todos", {
            params: {
               _limit: 5
            }
         })
         .then(res => this.showOutput(res))
         .catch(err => console.error(err));
   }

   showOutput(res) {
      this.template.querySelector(".res").innerHTML = `
        <div class="card card-body mb-4">
          <h5>Status: ${res.status}</h5>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            Headers
          </div>
          <div class="card-body">
            <pre>${JSON.stringify(res.headers, null, 2)}</pre>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            Data
          </div>
          <div class="card-body">
            <pre>${JSON.stringify(res.data, null, 2)}</pre>
          </div>
        </div>
        <div class="card mt-3">
          <div class="card-header">
            Config
          </div>
          <div class="card-body">
            <pre>${JSON.stringify(res.config, null, 2)}</pre>
          </div>
        </div>`;
   }
}
