import { Module } from '@nestjs/common';
import { NoticeBoardController } from './notice-board.controller';

@Module({
  controllers: [NoticeBoardController],
})
export class NoticeBoardModule {}
