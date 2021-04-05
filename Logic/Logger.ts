import { LoggerBuilder, LoggerConfigurationBuilder, LogLevel } from "simplr-logger";
import { FileMessageHandler, ConsoleMessageHandler } from "simplr-logger/handlers";

const config = new LoggerConfigurationBuilder()
    .SetDefaultLogLevel(LogLevel.Trace)
    .AddWriteMessageHandlers([
        { Handler: new ConsoleMessageHandler() },
        { Handler: new FileMessageHandler("C:\\Users\\liorp\\OneDrive\\Desktop\\New folder (2)\\logs.txt") }]
    )
    .Build();

export const logger = new LoggerBuilder(config);