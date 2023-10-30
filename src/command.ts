import { DiscordImage, MJConfig } from "./interfaces";

export const SdCommandNames=[
  'dream'
]
export const Commands = [
  "ask",
  "blend",
  "describe",
  "fast",
  "help",
  "imagine",
  "info",
  "prefer",
  "private",
  "public",
  "relax",
  "settings",
  "show",
  "stealth",
  "shorten",
  "subscribe",
] as const;
export type CommandName = (typeof Commands)[number]|(typeof SdCommandNames)[number];
function getCommandName(name: string): CommandName | undefined {
  for (const command of Commands) {
    if (command === name) {
      return command;
    }
  }
}

export class Command {
  constructor(public config: MJConfig) {}
  cache: Partial<Record<CommandName, Command>> = {};

  async cacheCommand(name: CommandName) {
    if (this.cache[name] !== undefined) {
      return this.cache[name];
    }
    if (this.config.ChannelId) {
      const command = await this.getCommand(name);
      this.cache[name] = command;
      return command;
    }
    this.allCommand();
    return this.cache[name];
  }
  async allCommand() {
    const searchParams = new URLSearchParams({
      type: "1",
      include_applications: "true",
    });
    const url = `${this.config.DiscordBaseUrl}/api/v9/channels/${this.config.ChannelId}/application-commands/search?${searchParams}`;

    const response = await this.config.fetch(url, {
      headers: { authorization: this.config.SalaiToken },
    });

    const data = await response.json();
    if (data?.application_commands) {
      data.application_commands.forEach((command: any) => {
        const name = getCommandName(command.name);
        if (name) {
          this.cache[name] = command;
        }
      });
    }
  }

  async getCommand(name: CommandName) {
    const searchParams = new URLSearchParams({
      type: "1",
      query: name,
      limit: "1",
      include_applications: "true",
      // command_ids: `${this.config.BotId}`,
    });
    const url = `${this.config.DiscordBaseUrl}/api/v9/channels/${this.config.ChannelId}/application-commands/search?${searchParams}`;
    const response = await this.config.fetch(url, {
      headers: { authorization: this.config.SalaiToken },
    });
    const data = await response.json();
    if ("application_commands" in data) {
      const application_commands = data.application_commands;
      let filterArr=application_commands.filter((item:any)=>item.name===name);
      if (filterArr[0]) {
          // console.log(
          //   `got ${name} application_commands`,
          //   application_commands[0]
          // );
          return filterArr[0]
      }
      if(application_commands[0]){
        return application_commands[0]
      }
    }
    console.log(`Failed to get application_commands for command ${name}`,this.config.ChannelId);
    return data;
  }
  async imaginePayload(prompt: string, nonce?: string) {
    const data = await this.commandData("imagine", [
      {
        type: 3,
        name: "prompt",
        value: prompt,
      },
    ]);
    return this.data2Paylod(data, nonce);
  }
  async imagineSdPayload() {
    const data = await this.commandData("dream");
    return data
  }
  async PreferPayload(nonce?: string) {
    const data = await this.commandData("prefer", [
      {
        type: 1,
        name: "remix",
        options: [],
      },
    ]);
    return this.data2Paylod(data, nonce);
  }

  async shortenPayload(prompt: string, nonce?: string) {
    const data = await this.commandData("shorten", [
      {
        type: 3,
        name: "prompt",
        value: prompt,
      },
    ]);
    return this.data2Paylod(data, nonce);
  }
  async infoPayload(nonce?: string) {
    const data = await this.commandData("info");
    return this.data2Paylod(data, nonce);
  }
  async fastPayload(nonce?: string) {
    const data = await this.commandData("fast");
    return this.data2Paylod(data, nonce);
  }
  async relaxPayload(nonce?: string) {
    const data = await this.commandData("relax");
    return this.data2Paylod(data, nonce);
  }
  async settingsPayload(nonce?: string) {
    const data = await this.commandData("settings");
    return this.data2Paylod(data, nonce);
  }
  async describePayload(image: DiscordImage, nonce?: string) {
    const data = await this.commandData(
      "describe",
      [
        {
          type: 11,
          name: "image",
          value: image.id,
        },
      ],
      [
        {
          id: <string>image.id,
          filename: image.filename,
          uploaded_filename: image.upload_filename,
        },
      ]
    );
    return this.data2Paylod(data, nonce);
  }

  protected async commandData(
    name: CommandName,
    options: any[] = [],
    attachments: any[] = []
  ) {
    const command = await this.cacheCommand(name);
    if(!command||command.code){
      return command||{} as any;
    }
    const data = {
      version: command.version,
      id: command.id,
      name: command.name,
      type: command.type,
      options,
      application_command: command,
      attachments,
    };
    return data;
  }
  //TODO data type
  protected data2Paylod(data: any, nonce?: string) {
    const payload = {
      type: 2,
      application_id: data.application_command?data.application_command.application_id:'',
      guild_id: this.config.ServerId,
      channel_id: this.config.ChannelId,
      session_id: this.config.SessionId,
      nonce,
      data,
    };
    return payload;
  }
}
