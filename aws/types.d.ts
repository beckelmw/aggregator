import { StackProps } from "aws-cdk-lib";

interface ReaderStackProps extends StackProps {
  domainName: string;
  subdomainName: string;
  bucketName?: string;
  certificateARN: string;
  cacheSeconds?: number;
}
