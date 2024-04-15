import 'dotenv/config'

const envExceptionError = (envVariable: string): string => {
    return `${envVariable} not defined`
}

const server_port = process.env.SERVER_PORT
if (server_port === undefined) throw new Error(envExceptionError("SERVER_PORT"))
export const SERVER_PORT = server_port