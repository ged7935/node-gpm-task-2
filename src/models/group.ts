type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

interface Group {
    id: number;
    name: string;
    permissions: Permission[];
};

export { Group, Permission };