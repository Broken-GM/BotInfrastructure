import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VpcStack extends cdk.Stack {
    public readonly privateSubnet: ec2.Subnet;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC
        const vpc = new ec2.Vpc(this, 'main-broken-gm-bot-vpc', {
            ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/21'),
            maxAzs: 1,
            natGateways: 0,
            subnetConfiguration: [],
        });

        // Create and Attach Internet Gateway
        const internetGateway = new ec2.CfnInternetGateway(this, 'main-broken-gm-bot-vpc-ig');
        new ec2.CfnVPCGatewayAttachment(this, 'main-broken-gm-bot-vpc-ig-attachment', {
            vpcId: vpc.vpcId,
            internetGatewayId: internetGateway.ref,
        });

        // Create Public Subnet
        const publicSubnet = new ec2.PublicSubnet(this, 'main-broken-gm-bot-vpc-public-subnet', {
            vpcId: vpc.vpcId,
            availabilityZone: cdk.Stack.of(this).availabilityZones[0],
            cidrBlock: '10.0.0.0/22',
            mapPublicIpOnLaunch: true,
        });

        // Add 0.0.0.0 Traffic Routing in Public Subnet to Internet Gateway
        const publicRouteTable = new ec2.CfnRouteTable(this, 'main-broken-gm-bot-vpc-public-subnet-route-table', {
            vpcId: vpc.vpcId,
        });
        new ec2.CfnRoute(this, 'main-broken-gm-bot-vpc-public-subnet-route-table-to-ig', {
            routeTableId: publicRouteTable.ref,
            destinationCidrBlock: '0.0.0.0/0',
            gatewayId: internetGateway.ref,
        });
        new ec2.CfnSubnetRouteTableAssociation(this, 'main-broken-gm-bot-vpc-public-subnet-route-table-association', {
            routeTableId: publicRouteTable.ref,
            subnetId: publicSubnet.subnetId,
        });

        // Create Private Subnet
        this.privateSubnet = new ec2.PrivateSubnet(this, 'main-broken-gm-bot-vpc-private-subnet', {
            vpcId: vpc.vpcId,
            availabilityZone: cdk.Stack.of(this).availabilityZones[0],
            cidrBlock: '10.0.4.0/22',
            mapPublicIpOnLaunch: false,
        });
    }
}
