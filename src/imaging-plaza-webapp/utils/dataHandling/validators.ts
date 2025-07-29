export const urlValidator = /(https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,6})([\/\w.-]*)*\/?/
export const hostingPlatformValidator = /(github|gitlab|bitbucket|renkulab|c4science)/
export const DOIValidator = new RegExp('(?:^(10[.][0-9]{2,}(?:[.][0-9]+)*/(?:(?![%"#? ])\\S)+)$)')
export const ORCIDValidator = /^(\d{4}-){3}\d{3}(\d|X)$/

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const emailValidator = (email: string) => {
  const re = emailRegex
  return re.test(email.toLowerCase())
}

export const nameValidator = (name: any) => {
  return !!name
}

export enum HostingPlatforms {
  Github,
  Gitlab,
  Bitbucket,
  Other,
}

export const validVCS = (url: string) => {
  if (url.toLowerCase().includes('github')) {
    return HostingPlatforms.Github
  } else if (url.toLowerCase().includes('gitlab')) {
    return HostingPlatforms.Gitlab
  } else if (url.toLowerCase().includes('bitbucket')) {
    return HostingPlatforms.Bitbucket
  }
  return HostingPlatforms.Other
}
