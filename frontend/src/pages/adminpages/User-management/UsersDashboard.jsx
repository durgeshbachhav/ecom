import { useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAccounts, selectAllUser, selectUserError, selectUserStatus } from "@/store/slices/UserSlice";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import ErrorComponent from "@/components/skeleton/ErrorComponent";
import LoadingSpinner from "@/components/skeleton/LoadingSpinner";

const UsersDashboard = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUser);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    console.log('Current user role:', currentUser?.role);
    dispatch(fetchAllAccounts());
  }, [dispatch]);

  if (status === 'loading') {
    return <AdminLayout>
      <LoadingSpinner />
    </AdminLayout>;
  }

  if (status === 'failed') {
    return <AdminLayout><ErrorComponent error={error} /></AdminLayout>;
  }

  // const handleChangeUserRole =(email)=>{
  //   dispatch(changeUserRole({email,  newRole:'admin'}))
  // }

  return (
    <AdminLayout>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/admin/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/admin/orders">Users</Link>
          </BreadcrumbItem>

        </BreadcrumbList>
      </Breadcrumb>
      <CardHeader>
        <CardTitle>Users Dashboard</CardTitle>
      </CardHeader>
      <Card className="w-full">

        <CardContent>
          {allUsers.length > 0 ? (
            <Table>
              <TableCaption>A list of all users</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Auth Provider</TableHead>
                  <TableHead>Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'super_admin' ? 'destructive' : 'default'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.authProvider}</TableCell>
                    <TableCell>
                      <Badge variant={user.isVerified ? 'success' : 'secondary'}>
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link>
                            <DropdownMenuItem >
                              
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No users found.</p>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UsersDashboard;