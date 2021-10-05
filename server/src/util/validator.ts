import UsernamePasswordInput from "./UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater 2 letters",
      },
    ];
  }

  if (options.username.length > 20) {
    return [
      {
        field: "username",
        message: "length must no longer than 20 letters",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "username cannot contains '@' ",
      },
    ];
  }

  if (options.email.length < 3) {
    return [
      {
        field: "email",
        message: "length must be greater 3 letters",
      },
    ];
  }

  if (!validateEmail(options.email)) {
    return [
      {
        field: "email",
        message: "must be a valid email",
      },
    ];
  }

  return validatePassword(options.password)
};


export function validatePassword(password:string)  {
    if(password.length <=3) {
      return [
        {
          field: "password",
          message: "length must be greater 3 letters",
        },
      ];
    }
    return null;
}

function validateEmail(email: string): boolean {
  const pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );

  return pattern.test(email);
}
