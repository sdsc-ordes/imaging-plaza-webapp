import { ZodType } from 'zod';

type ReadFileOptions = {
    strict: boolean;
};
declare const splitFilenameAndExtension: (fileName: string) => string[];
declare const getFileExtension: (fileName: string) => string;
declare const lookForFile: (files: File[], fileName: string, options?: ReadFileOptions) => File | undefined;

type ParsedFileResult<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: Error;
};
declare function readAndParseJsonFile<T>(file: File, model: ZodType<T>): Promise<ParsedFileResult<T>>;
declare function lookForAndParseFile<T>(files: File[], fileName: string, model: ZodType<T>, options?: ReadFileOptions): Promise<ParsedFileResult<T>>;

export { ParsedFileResult, ReadFileOptions, getFileExtension, lookForAndParseFile, lookForFile, readAndParseJsonFile, splitFilenameAndExtension };
