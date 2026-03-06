import { Injectable } from '@angular/core';

export interface Program {
  _id: string;
  name: string;
  capacity: number;
  enrolled: number;
  department: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  programApplied: string;
  applicationDate: string;
  status: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
  qualifications: string;
}

export interface ReviewApplication {
  _id: string;
  applicantName: string;
  applicantEmail: string;
  programName: string;
  submissionDate: string;
  status: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
  reviewNotes: string;
  decisionDate?: string;
  decisionReason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private programs: Program[] = [
    {
      _id: '1',
      name: 'Master of Computer Science',
      capacity: 50,
      enrolled: 38,
      department: 'Engineering',
      status: 'Active',
      createdAt: '2024-01-15'
    },
    {
      _id: '2',
      name: 'Master of Business Administration',
      capacity: 60,
      enrolled: 45,
      department: 'Business',
      status: 'Active',
      createdAt: '2024-01-20'
    },
    {
      _id: '3',
      name: 'Master of Data Science',
      capacity: 40,
      enrolled: 40,
      department: 'Engineering',
      status: 'Active',
      createdAt: '2024-02-01'
    },
    {
      _id: '4',
      name: 'Master of Psychology',
      capacity: 30,
      enrolled: 15,
      department: 'Health Sciences',
      status: 'Active',
      createdAt: '2024-02-10'
    },
    {
      _id: '5',
      name: 'Master of Environmental Studies',
      capacity: 35,
      enrolled: 28,
      department: 'Environmental Science',
      status: 'Active',
      createdAt: '2024-02-15'
    },
    {
      _id: '6',
      name: 'Master of Finance',
      capacity: 45,
      enrolled: 22,
      department: 'Business',
      status: 'Active',
      createdAt: '2024-02-20'
    },
    {
      _id: '7',
      name: 'Master of Law',
      capacity: 40,
      enrolled: 35,
      department: 'Law',
      status: 'Inactive',
      createdAt: '2024-03-01'
    },
    {
      _id: '8',
      name: 'Master of Artificial Intelligence',
      capacity: 50,
      enrolled: 32,
      department: 'Engineering',
      status: 'Active',
      createdAt: '2024-03-05'
    }
  ];

  private applicants: Applicant[] = [
    {
      _id: '101',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0101',
      programApplied: 'Master of Computer Science',
      applicationDate: '2024-01-10',
      status: 'Accepted',
      qualifications: 'BSc Computer Science, GPA: 3.8'
    },
    {
      _id: '102',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0102',
      programApplied: 'Master of Business Administration',
      applicationDate: '2024-01-15',
      status: 'Under Review',
      qualifications: 'BBA Marketing, GPA: 3.5, 2 years work experience'
    },
    {
      _id: '103',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1-555-0103',
      programApplied: 'Master of Data Science',
      applicationDate: '2024-01-20',
      status: 'Pending',
      qualifications: 'BSc Statistics, GPA: 3.7, Python/R proficient'
    },
    {
      _id: '104',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1-555-0104',
      programApplied: 'Master of Psychology',
      applicationDate: '2024-01-25',
      status: 'Accepted',
      qualifications: 'BA Psychology, GPA: 3.9, Research experience'
    },
    {
      _id: '105',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1-555-0105',
      programApplied: 'Master of Environmental Studies',
      applicationDate: '2024-02-01',
      status: 'Rejected',
      qualifications: 'BS Biology, GPA: 2.8'
    },
    {
      _id: '106',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1-555-0106',
      programApplied: 'Master of Finance',
      applicationDate: '2024-02-05',
      status: 'Under Review',
      qualifications: 'BBA Accounting, GPA: 3.6, CPA candidate'
    },
    {
      _id: '107',
      name: 'Robert Martinez',
      email: 'robert.martinez@email.com',
      phone: '+1-555-0107',
      programApplied: 'Master of Computer Science',
      applicationDate: '2024-02-10',
      status: 'Pending',
      qualifications: 'BSc Information Technology, GPA: 3.4'
    },
    {
      _id: '108',
      name: 'Jennifer Taylor',
      email: 'jennifer.taylor@email.com',
      phone: '+1-555-0108',
      programApplied: 'Master of Artificial Intelligence',
      applicationDate: '2024-02-15',
      status: 'Accepted',
      qualifications: 'MSc Computer Science, GPA: 3.9, Published researcher'
    },
    {
      _id: '109',
      name: 'Christopher Garcia',
      email: 'christopher.garcia@email.com',
      phone: '+1-555-0109',
      programApplied: 'Master of Business Administration',
      applicationDate: '2024-02-20',
      status: 'Pending',
      qualifications: 'BS Economics, GPA: 3.3, 3 years management experience'
    },
    {
      _id: '110',
      name: 'Amanda Brown',
      email: 'amanda.brown@email.com',
      phone: '+1-555-0110',
      programApplied: 'Master of Psychology',
      applicationDate: '2024-02-25',
      status: 'Under Review',
      qualifications: 'BA Psychology, GPA: 3.7, Internship experience'
    },
    {
      _id: '111',
      name: 'Kevin Lee',
      email: 'kevin.lee@email.com',
      phone: '+1-555-0111',
      programApplied: 'Master of Data Science',
      applicationDate: '2024-03-01',
      status: 'Pending',
      qualifications: 'BSc Mathematics, GPA: 3.6, SQL and Python skills'
    },
    {
      _id: '112',
      name: 'Nicole White',
      email: 'nicole.white@email.com',
      phone: '+1-555-0112',
      programApplied: 'Master of Environmental Studies',
      applicationDate: '2024-03-05',
      status: 'Accepted',
      qualifications: 'BS Environmental Science, GPA: 3.8, Field experience'
    },
    {
      _id: '113',
      name: 'James Robinson',
      email: 'james.robinson@email.com',
      phone: '+1-555-0113',
      programApplied: 'Master of Finance',
      applicationDate: '2024-03-10',
      status: 'Rejected',
      qualifications: 'BA Business, GPA: 2.9'
    },
    {
      _id: '114',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1-555-0114',
      programApplied: 'Master of Computer Science',
      applicationDate: '2024-03-15',
      status: 'Under Review',
      qualifications: 'BS Computer Engineering, GPA: 3.5'
    },
    {
      _id: '115',
      name: 'Thomas Johnson',
      email: 'thomas.johnson@email.com',
      phone: '+1-555-0115',
      programApplied: 'Master of Artificial Intelligence',
      applicationDate: '2024-03-20',
      status: 'Pending',
      qualifications: 'BSc Physics, GPA: 3.7, Machine learning background'
    }
  ];

  private reviewApplications: ReviewApplication[] = [
    {
      _id: 'app-1',
      applicantName: 'John Smith',
      applicantEmail: 'john.smith@email.com',
      programName: 'Master of Computer Science',
      submissionDate: '2024-01-10',
      status: 'Accepted',
      reviewNotes: 'Excellent qualifications and strong background in CS',
      decisionDate: '2024-01-25',
      decisionReason: 'Outstanding academic record and relevant experience'
    },
    {
      _id: 'app-2',
      applicantName: 'Sarah Johnson',
      applicantEmail: 'sarah.johnson@email.com',
      programName: 'Master of Business Administration',
      submissionDate: '2024-01-15',
      status: 'Under Review',
      reviewNotes: 'Good work experience, reviewing references'
    },
    {
      _id: 'app-3',
      applicantName: 'Michael Chen',
      applicantEmail: 'michael.chen@email.com',
      programName: 'Master of Data Science',
      submissionDate: '2024-01-20',
      status: 'Pending',
      reviewNotes: 'Application received, awaiting initial review'
    },
    {
      _id: 'app-4',
      applicantName: 'Emily Davis',
      applicantEmail: 'emily.davis@email.com',
      programName: 'Master of Psychology',
      submissionDate: '2024-01-25',
      status: 'Accepted',
      reviewNotes: 'Excellent academic performance and research background',
      decisionDate: '2024-02-05',
      decisionReason: 'Strong researcher with relevant publications'
    },
    {
      _id: 'app-5',
      applicantName: 'David Wilson',
      applicantEmail: 'david.wilson@email.com',
      programName: 'Master of Environmental Studies',
      submissionDate: '2024-02-01',
      status: 'Rejected',
      reviewNotes: 'Below minimum GPA requirement',
      decisionDate: '2024-02-10',
      decisionReason: 'GPA below 3.0 minimum requirement'
    },
    {
      _id: 'app-6',
      applicantName: 'Lisa Anderson',
      applicantEmail: 'lisa.anderson@email.com',
      programName: 'Master of Finance',
      submissionDate: '2024-02-05',
      status: 'Under Review',
      reviewNotes: 'CPA candidate, strong accounting background, scheduling interview'
    },
    {
      _id: 'app-7',
      applicantName: 'Robert Martinez',
      applicantEmail: 'robert.martinez@email.com',
      programName: 'Master of Computer Science',
      submissionDate: '2024-02-10',
      status: 'Pending',
      reviewNotes: 'Application complete, queued for review'
    },
    {
      _id: 'app-8',
      applicantName: 'Jennifer Taylor',
      applicantEmail: 'jennifer.taylor@email.com',
      programName: 'Master of Artificial Intelligence',
      submissionDate: '2024-02-15',
      status: 'Accepted',
      reviewNotes: 'Published researcher with advanced qualifications',
      decisionDate: '2024-02-28',
      decisionReason: 'Exceptional academic credentials and AI research experience'
    },
    {
      _id: 'app-9',
      applicantName: 'Christopher Garcia',
      applicantEmail: 'christopher.garcia@email.com',
      programName: 'Master of Business Administration',
      submissionDate: '2024-02-20',
      status: 'Pending',
      reviewNotes: 'Diverse work experience, awaiting review'
    },
    {
      _id: 'app-10',
      applicantName: 'Amanda Brown',
      applicantEmail: 'amanda.brown@email.com',
      programName: 'Master of Psychology',
      submissionDate: '2024-02-25',
      status: 'Under Review',
      reviewNotes: 'Strong academics with relevant internship experience'
    },
    {
      _id: 'app-11',
      applicantName: 'Kevin Lee',
      applicantEmail: 'kevin.lee@email.com',
      programName: 'Master of Data Science',
      submissionDate: '2024-03-01',
      status: 'Pending',
      reviewNotes: 'Strong quantitative background'
    },
    {
      _id: 'app-12',
      applicantName: 'Nicole White',
      applicantEmail: 'nicole.white@email.com',
      programName: 'Master of Environmental Studies',
      submissionDate: '2024-03-05',
      status: 'Accepted',
      reviewNotes: 'Excellent field experience and GPA',
      decisionDate: '2024-03-15',
      decisionReason: 'Strong commitment to environmental science'
    },
    {
      _id: 'app-13',
      applicantName: 'James Robinson',
      applicantEmail: 'james.robinson@email.com',
      programName: 'Master of Finance',
      submissionDate: '2024-03-10',
      status: 'Rejected',
      reviewNotes: 'Below minimum academic standards',
      decisionDate: '2024-03-18',
      decisionReason: 'GPA below 3.0 minimum requirement'
    },
    {
      _id: 'app-14',
      applicantName: 'Maria Garcia',
      applicantEmail: 'maria.garcia@email.com',
      programName: 'Master of Computer Science',
      submissionDate: '2024-03-15',
      status: 'Under Review',
      reviewNotes: 'Solid engineering background, reviewing transcripts'
    },
    {
      _id: 'app-15',
      applicantName: 'Thomas Johnson',
      applicantEmail: 'thomas.johnson@email.com',
      programName: 'Master of Artificial Intelligence',
      submissionDate: '2024-03-20',
      status: 'Pending',
      reviewNotes: 'Physics background with ML interest'
    }
  ];

  constructor() {}

  getPrograms(): Program[] {
    return JSON.parse(JSON.stringify(this.programs));
  }

  getProgramById(id: string): Program | undefined {
    return JSON.parse(JSON.stringify(this.programs.find(p => p._id === id)));
  }

  addProgram(program: Omit<Program, '_id' | 'createdAt'>): Program {
    const newProgram: Program = {
      ...program,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.programs.push(newProgram);
    return newProgram;
  }

  updateProgram(id: string, updates: Partial<Program>): Program | undefined {
    const index = this.programs.findIndex(p => p._id === id);
    if (index !== -1) {
      this.programs[index] = { ...this.programs[index], ...updates };
      return JSON.parse(JSON.stringify(this.programs[index]));
    }
    return undefined;
  }

  deleteProgram(id: string): boolean {
    const index = this.programs.findIndex(p => p._id === id);
    if (index !== -1) {
      this.programs.splice(index, 1);
      return true;
    }
    return false;
  }

  getApplicants(): Applicant[] {
    return JSON.parse(JSON.stringify(this.applicants));
  }

  getApplicantById(id: string): Applicant | undefined {
    return JSON.parse(JSON.stringify(this.applicants.find(a => a._id === id)));
  }

  getReviewApplications(): ReviewApplication[] {
    return JSON.parse(JSON.stringify(this.reviewApplications));
  }

  getReviewApplicationById(id: string): ReviewApplication | undefined {
    return JSON.parse(JSON.stringify(this.reviewApplications.find(a => a._id === id)));
  }

  updateApplicationStatus(id: string, status: string, reason?: string): ReviewApplication | undefined {
    const index = this.reviewApplications.findIndex(a => a._id === id);
    if (index !== -1) {
      this.reviewApplications[index] = {
        ...this.reviewApplications[index],
        status: status as any,
        decisionDate: new Date().toISOString().split('T')[0],
        decisionReason: reason
      };
      return JSON.parse(JSON.stringify(this.reviewApplications[index]));
    }
    return undefined;
  }

  updateApplicationReviewNotes(id: string, notes: string): ReviewApplication | undefined {
    const index = this.reviewApplications.findIndex(a => a._id === id);
    if (index !== -1) {
      this.reviewApplications[index] = {
        ...this.reviewApplications[index],
        reviewNotes: notes
      };
      return JSON.parse(JSON.stringify(this.reviewApplications[index]));
    }
    return undefined;
  }
}
