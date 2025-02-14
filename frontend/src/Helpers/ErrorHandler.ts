import { BasicNotification } from "./NotificationHelper";

// Helper to ensure the value is a string
const toErrorString = (value: any): string => {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
};

export const handleError = (error: any) => {
  const err = error.response;

  if(err?.status==400 &&err.data&&Array.isArray(err.data)&&typeof(err.data[0].code&&err.data[0].code) =="string"){
    for (let val of err.data) {
      BasicNotification(toErrorString(val.description));
    }
    return;

  }
  if (Array.isArray(err?.data.errors)) {
    for (let val of err.data.errors) {
      BasicNotification(toErrorString(val.description));
    }
  } else if (typeof err?.data.errors === "object") {
    for (let key in err.data.errors) {
      BasicNotification(toErrorString(err.data.errors[key][0]));
    }
  } else if (err?.data) {
    if(err.data.message){
        BasicNotification(toErrorString(err.data.message));
        return;
    }
    BasicNotification(toErrorString(err.data));
  } else if (err?.status === 401) {
    BasicNotification("Please login");
    window.history.pushState({}, "LoginPage", "/login");
  } else if (err) {
    BasicNotification(toErrorString(err.data));
  }else{
    BasicNotification("Something went wrong");
  }
};
