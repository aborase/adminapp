// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  KW_REST_API: "http://192.168.43.150:31607/kw/api/v1/webadmin/",
  ST_SHARED_API: "http://192.168.43.150:5000/stss/api/v1/"
};
