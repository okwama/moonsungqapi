import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesRep } from '../entities/sales-rep.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ClockInOutService } from '../clock-in-out/clock-in-out.service';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(SalesRep)
    private userRepository: Repository<SalesRep>,
    private cloudinaryService: CloudinaryService,
    private clockInOutService: ClockInOutService,
  ) {}

  async findById(id: number): Promise<SalesRep | null> {
    return this.userRepository.findOne({
      where: { id, status: 1 },
      relations: ['role'], // Include role relation to get role name
    });
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Validate password length
    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    // Get user with current password
    const user = await this.userRepository.findOne({
      where: { id: userId, status: 1 },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedNewPassword,
    });

    this.logger.log(`✅ Password updated for user ID: ${userId}`);

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }

  async updateEmail(userId: number, email: string): Promise<{ success: boolean; message: string }> {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check if email is already in use by another user
    const existingUser = await this.userRepository.findOne({
      where: { email, status: 1 },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Email is already in use by another user');
    }

    // Get current user
    const user = await this.userRepository.findOne({
      where: { id: userId, status: 1 },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update email
    await this.userRepository.update(userId, {
      email: email,
    });

    this.logger.log(`✅ Email updated for user ID: ${userId} to: ${email}`);

    return {
      success: true,
      message: 'Email updated successfully',
    };
  }

  async updateProfilePhoto(userId: number, file: Express.Multer.File): Promise<string> {
    this.logger.log(`📸 Starting photo upload for user ${userId}`);
    this.logger.log(`📁 File details:`, {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      buffer: file?.buffer ? 'Present' : 'Missing',
      path: file?.path || 'No path'
    });

    // Validate file exists
    if (!file) {
      throw new BadRequestException('No photo file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG and PNG files are allowed');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    try {
      // Get current user to check if they have an existing photo
      const user = await this.userRepository.findOne({
        where: { id: userId, status: 1 },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      let fileBuffer: Buffer;

      // Handle different file upload scenarios
      if (file.buffer) {
        // File has buffer (memory storage)
        fileBuffer = file.buffer;
        this.logger.log(`📤 Using file buffer (${fileBuffer.length} bytes)`);
      } else if (file.path) {
        // File has path (disk storage) - read the file
        this.logger.log(`📤 Reading file from path: ${file.path}`);
        fileBuffer = fs.readFileSync(file.path);
        this.logger.log(`📤 Read file from path (${fileBuffer.length} bytes)`);
      } else {
        throw new BadRequestException('File has no buffer or path. Please ensure the file was uploaded correctly.');
      }

      this.logger.log(`📤 Uploading file buffer to Cloudinary...`);

      // Upload to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadToCloudinary(fileBuffer, {
        folder: 'whoosh/profile_photos',
        mimetype: file.mimetype,
        public_id: `profile_${userId}_${Date.now()}`,
      });

      this.logger.log(`✅ Cloudinary upload successful: ${uploadResult.url}`);

      // Update user's photo URL in database
      await this.userRepository.update(userId, {
        photoUrl: uploadResult.url,
      });

      this.logger.log(`✅ Profile photo updated for user ID: ${userId}, URL: ${uploadResult.url}`);

      return uploadResult.url;
    } catch (error) {
      this.logger.error(`❌ Error updating profile photo for user ${userId}:`, error);
      throw error;
    }
  }

  async getSessionHistory(
    userId: number,
    startDate?: string,
    endDate?: string,
    period?: string,
  ): Promise<any[]> {
    this.logger.log(`📊 Getting session history for user ${userId}`);
    
    try {
      // Use the existing clock-in-out service to get session history
      const sessions = await this.clockInOutService.getClockSessionsWithProcedure(
        userId,
        startDate,
        endDate,
      );
      
      // Handle the response structure properly
      const sessionList = Array.isArray(sessions) ? sessions : sessions?.sessions || [];
      this.logger.log(`✅ Retrieved ${sessionList.length} sessions for user ${userId}`);
      return sessionList;
    } catch (error) {
      this.logger.error(`❌ Error getting session history for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserStats(
    userId: number,
    startDate?: string,
    endDate?: string,
    month?: string,
  ): Promise<any> {
    this.logger.log(`📈 Getting user stats for user ${userId}`);
    
    try {
      // Get login hours data
      const loginHoursData = await this.getLoginHoursData(userId, startDate, endDate, month);
      
      // Get journey plan data
      const journeyPlanData = await this.getJourneyPlanData(userId, startDate, endDate, month);
      
      // Get targets data
      const targetsData = await this.getTargetsData(userId, startDate, endDate, month);
      
      const stats = {
        loginHours: loginHoursData,
        journeyPlans: journeyPlanData,
        targets: targetsData,
        summary: {
          totalLoginHours: loginHoursData.totalHours || 0,
          totalJourneyPlans: journeyPlanData.totalPlans || 0,
          completedTargets: targetsData.completed || 0,
          totalTargets: targetsData.total || 0,
        }
      };
      
      this.logger.log(`✅ Retrieved user stats for user ${userId}`);
      return stats;
    } catch (error) {
      this.logger.error(`❌ Error getting user stats for user ${userId}:`, error);
      throw error;
    }
  }

  async deleteAccount(userId: number): Promise<{ success: boolean; message: string }> {
    this.logger.log(`🗑️ Deleting account for user ${userId}`);
    
    try {
      // Soft delete by setting status to 0
      await this.userRepository.update(userId, {
        status: 0,
        // You might want to add additional fields like deletedAt
      });
      
      this.logger.log(`✅ Account deleted for user ${userId}`);
      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      this.logger.error(`❌ Error deleting account for user ${userId}:`, error);
      throw error;
    }
  }

  private async getLoginHoursData(userId: number, startDate?: string, endDate?: string, month?: string): Promise<any> {
    // This would integrate with your existing analytics service
    // For now, returning mock data structure
    return {
      totalHours: 0,
      averageHoursPerDay: 0,
      dailyData: [],
    };
  }

  private async getJourneyPlanData(userId: number, startDate?: string, endDate?: string, month?: string): Promise<any> {
    // This would integrate with your existing journey plans service
    return {
      totalPlans: 0,
      completedPlans: 0,
      dailyData: [],
    };
  }

  private async getTargetsData(userId: number, startDate?: string, endDate?: string, month?: string): Promise<any> {
    // This would integrate with your existing targets service
    return {
      total: 0,
      completed: 0,
      dailyData: [],
    };
  }
} 