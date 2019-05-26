// export regex patterns these will not change
export const urlPattern = /(?!.*(?:\.jpe?g|\/iframe>|\.gif|\.png|\.mp4|\.mp3)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
export const imgUrlPattern = /(?=.*(?:\.jpe?g|\.gif|\.png)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
export const videoUrlPattern = /(?=.*(?:\.mp4|\.ogg)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
export const audioUrlPattern = /(?=.*(?:\.mp3)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
