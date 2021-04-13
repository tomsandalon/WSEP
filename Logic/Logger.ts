import { LoggerBuilder, LoggerConfigurationBuilder, LogLevel } from "simplr-logger";
import { FileMessageHandler, ConsoleMessageHandler } from "simplr-logger/handlers";

const config = new LoggerConfigurationBuilder()
    .SetDefaultLogLevel(LogLevel.Error)
    .AddWriteMessageHandlers([
        { Handler: new ConsoleMessageHandler() },
        { Handler: new FileMessageHandler("./Logs/Log.log") }]
    )
    .Build();

export const logger = new LoggerBuilder(config);