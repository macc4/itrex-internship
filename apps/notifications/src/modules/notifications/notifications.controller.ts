import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, GetUserDto, JwtGuard } from '@macc4-clinic/common';
import { IKafkaMessage } from './interfaces/IKafkaMessage';
import { IAppointmentCreated } from './interfaces/IAppointmentCreated';
import { IResolutionCreated } from './interfaces/IResolutionCreated';
import { CreateAppointmentNotificationCommand } from './commands/create-appointment/create-appointment.command';
import { CreateResolutionNotificationCommand } from './commands/create-resolution/create-resolution.command';
import { GetNotificationsQuery } from './queries/get-notifications/get-notifications.query';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @EventPattern('notification.create.appointment')
  createAppointmentCreatedNotification(
    @Payload() message: IKafkaMessage<IAppointmentCreated>,
  ): void {
    this.commandBus.execute(
      new CreateAppointmentNotificationCommand(message.value),
    );
  }

  @EventPattern('notification.create.resolution')
  createResolutionCreatedNotification(
    @Payload() message: IKafkaMessage<IResolutionCreated>,
  ): void {
    this.commandBus.execute(
      new CreateResolutionNotificationCommand(message.value),
    );
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get personal notifications',
  })
  @ApiOkResponse({
    description: 'Returns the list of notifications',
  })
  getMyNotifications(@GetUser() user: GetUserDto): any {
    return this.queryBus.execute(new GetNotificationsQuery(user.id));
  }
}
