import {LoggerBuilder, LoggerConfigurationBuilder, LogLevel} from "simplr-logger";
import {FileMessageHandler} from "simplr-logger/handlers";

const config = new LoggerConfigurationBuilder()
    .SetDefaultLogLevel(LogLevel.Trace)
    .AddWriteMessageHandlers([
        // { Handler: new ConsoleMessageHandler() },
        {Handler: new FileMessageHandler("./Logs/Log.log")}]
    )
    .Build();

const config_system_error = new LoggerConfigurationBuilder()
    .SetDefaultLogLevel(LogLevel.Trace)
    .AddWriteMessageHandlers([
        // { Handler: new ConsoleMessageHandler() },
        {Handler: new FileMessageHandler("./Logs/SystemLog.log")}]
    )
    .Build();

const config_server_event = new LoggerConfigurationBuilder()
    .SetDefaultLogLevel(LogLevel.Trace)
    .AddWriteMessageHandlers([
        // { Handler: new ConsoleMessageHandler() },
        {Handler: new FileMessageHandler("./Logs/Server.log")}]
    )
    .Build();

export const logger = new LoggerBuilder(config);
export const panicLogger = new LoggerBuilder(config_system_error);
export const serverLogger = new LoggerBuilder(config_server_event);