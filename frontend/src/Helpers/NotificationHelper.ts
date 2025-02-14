import { notifications } from "@mantine/notifications"

export  function BasicNotification (message:string) {

    notifications.show({message:message})
}