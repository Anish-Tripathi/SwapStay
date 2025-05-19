import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  User,
  HashIcon,
  GraduationCap,
  Phone,
  Calendar,
  BookOpen,
  Users,
  Mail,
  Lock,
  HelpCircle,
  Loader2,
} from "lucide-react";

interface SignupFormProps {
  formData: {
    name: string;
    rollNo: string;
    department: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    declaration: boolean;
    year: string;
    degree: string;
    gender: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  switchAuthMode: (mode: string) => void;
}

export const SignupForm = ({
  formData,
  handleInputChange,
  isLoading,
  onSubmit,
  switchAuthMode,
}: SignupFormProps) => {
  return (
    <Card className="w-full max-w-3xl border-purple-400 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-purple-900 dark:text-purple-300 text-2xl font-bold">
          <UserPlus className="h-6 w-6 inline mr-2" />
          Sign Up
        </CardTitle>
        <CardDescription className="text-center dark:text-gray-400">
          Create a new account to get started.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">
                Full Name
              </Label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Anish Tripathi"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNo" className="dark:text-gray-300">
                Roll Number
              </Label>
              <div className="relative">
                <HashIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="rollNo"
                  name="rollNo"
                  placeholder="221EC163"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="dark:text-gray-300">
                Department
              </Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "department", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                value={formData.department}
              >
                <SelectTrigger className="flex items-center dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="ece">Electronics</SelectItem>
                  <SelectItem value="me">Mechanical</SelectItem>
                  <SelectItem value="ce">Civil</SelectItem>
                  <SelectItem value="ee">Electrical</SelectItem>
                  <SelectItem value="cds">CDS</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-gray-300">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9867469877"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="dark:text-gray-300">
                Year
              </Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "year", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                value={formData.year}
              >
                <SelectTrigger className="flex items-center dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree" className="dark:text-gray-300">
                Degree
              </Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "degree", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                value={formData.degree}
              >
                <SelectTrigger className="flex items-center dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select Degree" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="btech">B.Tech</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                  <SelectItem value="msc">M.Sc</SelectItem>
                  <SelectItem value="phd">Ph.D.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="dark:text-gray-300">
                Gender
              </Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "gender", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                value={formData.gender}
              >
                <SelectTrigger className="flex items-center dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="xyz@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="dark:text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="dark:text-gray-300">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="declaration"
              name="declaration"
              checked={formData.declaration}
              onCheckedChange={(checked) =>
                handleInputChange({
                  target: { name: "declaration", value: checked },
                } as unknown as React.ChangeEvent<HTMLInputElement>)
              }
              className="dark:border-gray-600"
            />
            <Label
              htmlFor="declaration"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/terms"
                className="text-purple-600 hover:underline dark:text-purple-400"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => switchAuthMode("login")}
            className="text-purple-600 hover:underline dark:text-purple-400 font-medium"
          >
            Log in
          </button>
        </div>
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <HelpCircle className="h-3 w-3 mr-1" />
          Need help? Contact{" "}
          <a
            href="mailto:support@example.com"
            className="text-purple-600 hover:underline dark:text-purple-400 ml-1"
          >
            support@swapstay.com
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
