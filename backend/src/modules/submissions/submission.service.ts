// Business logic cho Submission module
import mongoose from 'mongoose';
import Submission, { ISubmission } from './submission.model';
import Mission from '../missions/mission.model';
import Subtask from '../missions/subtask.model';
import cloudinary from '../../config/cloudinary';

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export async function updateSubtask(missionId: string, subId: string, isDone: boolean) {
  if (!mongoose.Types.ObjectId.isValid(missionId)) {
    throw new Error('missionId không hợp lệ');
  }
  if (!mongoose.Types.ObjectId.isValid(subId)) {
    throw new Error('subId không hợp lệ');
  }

  const subtask = await Subtask.findOne({ _id: subId, mission_id: missionId });
  if (!subtask) {
    throw new Error('Không tìm thấy bước nhiệm vụ');
  }

  const updatedSubtask = await Subtask.findByIdAndUpdate(
    subId,
    { is_done: isDone },
    { new: true }
  ).lean();

  const totalTasks = await Subtask.countDocuments({ mission_id: missionId });
  const doneTasks = await Subtask.countDocuments({ mission_id: missionId, is_done: true });
  const progress_percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  if (progress_percent === 100) {
    await Mission.findByIdAndUpdate(missionId, {
      status: 'in_progress',
      updated_at: new Date(),
    });
  }

  return {
    subtask: updatedSubtask,
    progress_percent,
    total_subtasks: totalTasks,
    done_subtasks: doneTasks,
  };
}

export async function createSubmission(
  payload: { mission_id: string; child_id: string },
  file: UploadedFile
) {
  if (!mongoose.Types.ObjectId.isValid(payload.mission_id)) {
    throw new Error('mission_id không hợp lệ');
  }
  if (!mongoose.Types.ObjectId.isValid(payload.child_id)) {
    throw new Error('child_id không hợp lệ');
  }
  if (!file) {
    throw new Error('Ảnh minh chứng là bắt buộc');
  }

  let uploadResult: { secure_url: string; public_id: string } | null = null;

  const base64 = file.buffer.toString('base64');
  const dataURI = `data:${file.mimetype};base64,${base64}`;
  uploadResult = await cloudinary.uploader.upload(dataURI, {
    folder: 'kidlife/submissions',
    resource_type: 'image',
  });

  try {
    const mission = await Mission.findById(payload.mission_id);
    if (!mission) {
      throw new Error('Không tìm thấy nhiệm vụ');
    }
    if (mission.status === 'submitted' || mission.status === 'done') {
      throw new Error('Nhiệm vụ này đã được nộp trước đó');
    }

    const submission = await Submission.create({
      mission_id: payload.mission_id,
      child_id: payload.child_id,
      proof_image_url: uploadResult.secure_url,
      proof_image_public_id: uploadResult.public_id,
      status: 'submitted',
    });

    await Mission.findByIdAndUpdate(payload.mission_id, {
      status: 'submitted',
      updated_at: new Date(),
    });

    return submission.toObject();
  } catch (error) {
    if (uploadResult && uploadResult.public_id) {
      await cloudinary.uploader.destroy(uploadResult.public_id);
    }
    throw error;
  }
}
